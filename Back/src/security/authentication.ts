import * as  bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import random from 'random';

import { AccountAR } from '../models';
import passport from 'passport';
import verifyUser from './verifyUser';
import { LoggedInRequest } from '../types/types';
import { CreateAccount } from 'storyboard-networking';

const createAccount = (req: LoggedInRequest, username: string, password: string, done:any) => {
    const body: CreateAccount.Body = req.body as CreateAccount.Body;
    const account = new AccountAR({
        id: '',
        username,
        email: (body?.email) ?? null,
        mobile: (body?.mobile) ?? null,
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
		usernameField: 'username',
		passwordField: 'password',
		session: true,
	}, verifyUser));
	
	passport.use('createAccount', new Strategy({
		usernameField: 'username',
		passwordField: 'password',
        passReqToCallback: true,
		session: true,
	}, createAccount));
};

export {
    setupAuth,
};
