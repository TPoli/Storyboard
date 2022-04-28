import * as  bcrypt from 'bcrypt';

import { AccountAR, Model } from '../models';

type VerifyError = { message: string };
type VerifyDone = (placeholder: null,account: AccountAR|false, error?: VerifyError) => void;

const verifyUser = async (username: string, password: string, done: VerifyDone): Promise<void> => {

    const account = await Model.findOne<AccountAR>(AccountAR, {username: username}) as AccountAR|null;

    if (!account) {
        return done(null, false, { message: 'login failed.' });
    }

    const pepper = AccountAR.Peppers[account.pepper];
    if (!pepper) {
        return done(null, false, { message: 'login failed.' });
    }
    bcrypt.hash(password + pepper, account.salt, (err, hash) => {
        if (err) {
            return done(null, false, { message: 'login failed.' });
        }
        
        if (account.password === hash) {
            account.init();
            return done(null, account);
        } else {
            return done(null, false, { message: 'login failed.' });
        }
    });
};

export default verifyUser;