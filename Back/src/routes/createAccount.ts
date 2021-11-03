import AccountAR from '../models/accountAR';
import { IAccountFailResponse, ILoginResponse } from '../../../Core/types/Response';
import passport from 'passport';
import { ExpressFinalCallback } from '../types/types';

const createAccountFn: ExpressFinalCallback = (req, res, next) => {
	const loginCallback = (loginErr: any) => {
		if (loginErr) {
			console.log('error');
			return next?.(loginErr);
		}
		const response: ILoginResponse = {
			success: true,
			username: (req.user as AccountAR).username,
		};
		
		return (req as any).transaction.sendResponse(res, response);
	};

	passport.authenticate('createAccount', {session: true,}, (err: Error, user: AccountAR) => {
		if (err) {
			return next?.(err); // will generate a 500 error
		}
		if (!user) {
			const payload: IAccountFailResponse = {
				success: false,
				message: 'account creation failed',
			};
			(req as any).transaction.sendResponse(res, payload);
		}
		req.login(user, loginCallback); // not called automatically due to custom callback
	})(req, res, next);
};

export default createAccountFn;