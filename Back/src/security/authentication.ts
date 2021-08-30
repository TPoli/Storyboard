const bcrypt = require('bcrypt');
import { Strategy } from 'passport-local';
import random from 'random';

import Storyboard from '../storyboard';
import Account from '../models/account';

const createAccount = (username:any, password:any, done:any) => {
    const account = new Account();
    account.permissions = {};
    account.username = username;

    const refreshed = () => {
        return done(null, account);
    };
    const saved = (success: boolean) => {
        if (success) {
            account.refresh(refreshed);
        } else {
            return done(null, false, { message: 'login failed.' });
        }
    };

    const hashCallback = (err: Error, hash: string) => {
        if (err) {
            return done(null, false, { message: 'login failed.' });
        }
        account.password = hash;
        account.save(saved, [
            'username',
            'password',
            'permissions',
            'salt',
            'pepper'
        ]);
    };

    const saltRounds = 10;
    const saltCallback = (err: Error, salt: string) => {
        if (err) {
            return done(null, false, { message: 'login failed.' });
        }
        account.salt = salt;
        
        // assign a random pepper to the account
        const peppers = Account.Peppers();
        const pepperKeys = Object.keys(peppers);
        const pepperIndex = random.int(0, pepperKeys.length - 1);
        const pepperkey = pepperKeys[pepperIndex];
        const pepper = peppers[pepperkey];

        account.pepper = pepperkey;
        bcrypt.hash(password + pepper, salt, hashCallback);
    };

    bcrypt.genSalt(saltRounds, saltCallback);
};

const verifyUser = (username:any, password:any, done:any) => {
    (new Account).findOne({username: username}, (error: Error, account: Account|null) => {
        if (error) {
            return done(null, false, { message: 'login failed.' });
        }
        if (!account) {
            return done(null, false, { message: 'login failed.' });
        }

        const pepper = Account.Peppers()[account.pepper];
        if (!pepper) {
            return done(null, false, { message: 'login failed.' });
        }

        bcrypt.hash(password + pepper, account.salt, function(err: Error, hash: string) {
            if (err) {
                return done(null, false, { message: 'login failed.' });
            }
            
            if (account.password === hash) {
                return done(null, account);
            } else {
                return done(null, false, { message: 'login failed.' });
            }
        });
    });
};

export default () => {
	Storyboard.Instance().passport.use('login', new Strategy({
		usernameField: 'un',
		passwordField: 'pw',
		session: true
	}, verifyUser));
	
	Storyboard.Instance().passport.use('createAccount', new Strategy({
		usernameField: 'un',
		passwordField: 'pw',
		session: true
	}, createAccount));
};