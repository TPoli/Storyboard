import { AccountAR } from '../models';
import { IAccountFailResponse, Login } from 'storyboard-networking';
import passport from 'passport';
import { ExpressFinalCallback } from '../types/types';

const createAccount: ExpressFinalCallback<Login.Body> = (req, res, next) => {
	const loginCallback = (loginErr: Error) => {
		if (loginErr) {
			console.log('error');
			return next?.(loginErr);
		}
		const response: Login.Response = {
			success: true,
			username: (req.user as AccountAR).username,
		};
		
		return req.transaction.sendResponse(res, req, response);
	};

	passport.authenticate('createAccount', {session: true}, (err: Error, user: AccountAR) => {
		if (err) {
			return next?.(err); // will generate a 500 error
		}
		if (!user) {
			const payload: IAccountFailResponse = {
				success: false,
				message: 'account creation failed',
			};
			req.transaction.sendResponse(res, req, payload);
		}
		req.login(user, loginCallback); // not called automatically due to custom callback
	})(req, res, next);
};

export {
	createAccount,
}
