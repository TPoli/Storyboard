import * as  bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import random from 'random';

import { AccountAR } from '../models';
import passport from 'passport';
import verifyUser from './verifyUser';

const createAccount = (req:any, username:any, password:any, done:any) => {
    const account = new AccountAR({
        username,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
    });

    const hashCallback = async (err?: Error, hash?: string) => {
        if (err || !hash) {
            return done(null, false, { message: 'login failed.', });
        }
        account.password = hash;
        const columnsToSave = [
            'id',
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
        if (await account.save(req, columnsToSave)) {
            await account.refresh();
            account.init();
            return done(null, account);
        }
        return done(null, false, { message: 'login failed.', });
    };

    const saltRounds = 10;
    const saltCallback = (err?: Error, salt?: string) => {
        if (err || !salt) {
            return done(null, false, { message: 'login failed.', });
        }
        account.salt = salt;
        
        // assign a random pepper to the account
        const peppers = AccountAR.Peppers;
        const pepperKeys = Object.keys(peppers);
        const pepperIndex = random.int(0, pepperKeys.length - 1);
        const pepperKey = pepperKeys[pepperIndex];
        const pepper = peppers[pepperKey];

        account.pepper = pepperKey;
        bcrypt.hash(password + pepper, salt, hashCallback);
    };

    bcrypt.genSalt(saltRounds, saltCallback);
};

export default async (): Promise<void> => {
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
