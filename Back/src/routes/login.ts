import {
	AccountAR,
	IIndexable,
} from '../models';
import { IAuthFailResponse, ILoginResponse } from '../../../Core/types/Response'
import { ExpressFinalCallback } from '../types/types';
import passport from 'passport';

const loginFn: ExpressFinalCallback = (req, res, next) => {
	const login = (loginErr: Error) => {
		if (loginErr) {
			console.log('error');
			return next?.(loginErr);
		}
		const user: IIndexable = req.user;
		const payload: ILoginResponse = {
			success: true,
			username: user.username,
		};
		return req.transaction.sendResponse(res, req, payload);
	};

	passport.authenticate('login', {session: true}, (err: Error, user: AccountAR) => {
		if (err) {
			return next?.(err); // will generate a 500 error
		}
		if (!user) {
			const payload: IAuthFailResponse = {
				success: false,
				message: 'authentication failed',
			};
			return req.transaction.sendResponse(res, null, payload);
		}
		req.login(user, login); // not called automatically due to custom callback
	})(req, res, next);
};

export default loginFn;