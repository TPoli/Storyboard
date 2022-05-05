import * as  bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import random from 'random';

import { AccountAR } from '../models';
import passport from 'passport';
import verifyUser from './verifyUser';

const createAccount = (req:any, username:any, password: string, done:any) => {
    const account = new AccountAR({
        id: '',
        username,
        email: req?.body?.email || null,
        mobile: req?.body?.mobile || null,
    });

    const hashCallback = async (err?: Error, hash?: string) => {
        if (err || !hash) {
            return done(null, false, { message: 'login failed.' });
        }
        account.password = hash;
        const columnsToSave: Extract<keyof AccountAR, string>[] = [
            'id',
            'username',
            'password',
            'salt',
            'pepper',
            'email',
            'mobile',
        ];

        if (await account.save<AccountAR>(req, columnsToSave)) {
            await account.refresh();
            account.init();
            return done(null, account);
        }
        return done(null, false, { message: 'login failed.' });
    };

    const saltRounds = 10;
    const saltCallback = (err?: Error, salt?: string) => {
        if (err || !salt) {
            return done(null, false, { message: 'login failed.' });
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

const setupAuth = async (): Promise<void> => {
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

export {
    setupAuth,
};
