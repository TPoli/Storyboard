const bcrypt = require('bcrypt');
import { Strategy } from 'passport-local';
import random from 'random';

import { AccountAR } from '../models/accountAR';
import passport from 'passport';

const createAccount = (req:any, username:any, password:any, done:any) => {
    const account = new AccountAR();
    account.permissions = {};
    account.username = username;
    account.email = req?.body?.email ?? null;
    account.mobile = req?.body?.mobile ?? null;

    const refreshed = () => {
        return done(null, account);
    };
    const saved = (success: boolean) => {
        if (success) {
            account.refresh(refreshed);
        } else {
            return done(null, false, { message: 'login failed.', });
        }
    };

    const hashCallback = (err: Error, hash: string) => {
        if (err) {
            return done(null, false, { message: 'login failed.', });
        }
        account.password = hash;
        const columnsToSave = [
            'username',
            'password',
            'permissions',
            'salt',
            'pepper',
        ];
        if (account.email) {
            columnsToSave.push('email');
        }
        if (account.mobile) {
            columnsToSave.push('mobile');
        }
        account.save(saved, columnsToSave);
    };

    const saltRounds = 10;
    const saltCallback = (err: Error, salt: string) => {
        if (err) {
            return done(null, false, { message: 'login failed.', });
        }
        account.salt = salt;
        
        // assign a random pepper to the account
        const peppers = AccountAR.Peppers();
        const pepperKeys = Object.keys(peppers);
        const pepperIndex = random.int(0, pepperKeys.length - 1);
        const pepperkey = pepperKeys[pepperIndex];
        const pepper = peppers[pepperkey];

        account.pepper = pepperkey;
        bcrypt.hash(password + pepper, salt, hashCallback);
    };

    bcrypt.genSalt(saltRounds, saltCallback);
};

const verifyUser = (username: string, password: string, done:any) => {
    (new AccountAR).findOne({username: username,}, (error, account: AccountAR|null) => {
        if (error) {
            return done(null, false, { message: 'login failed.', });
        }
        if (!account) {
            return done(null, false, { message: 'login failed.', });
        }

        const pepper = AccountAR.Peppers()[account.pepper];
        if (!pepper) {
            return done(null, false, { message: 'login failed.', });
        }

        bcrypt.hash(password + pepper, account.salt, function(err: Error, hash: string) {
            if (err) {
                return done(null, false, { message: 'login failed.', });
            }
            
            if (account.password === hash) {
                return done(null, account);
            } else {
                return done(null, false, { message: 'login failed.', });
            }
        });
    });
};

export default () => {
	passport.use('login', new Strategy({
		usernameField: 'un',
		passwordField: 'pw',
		session: true,
	}, verifyUser));
	
	passport.use('createAccount', new Strategy({
		usernameField: 'un',
		passwordField: 'pw',
        passReqToCallback: true,
		session: true,
	}, createAccount));
};
