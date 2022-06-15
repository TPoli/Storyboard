import {
	AccountAR,
	IIndexable,
} from '../models';
import { ExpressFinalCallback } from '../types/types';
import passport from 'passport';
import { IAuthFailResponse, Login } from 'storyboard-networking';

const login: ExpressFinalCallback<Login.Body> = (req, res, next) => {
	const loginFn = (loginErr: Error) => {
		if (loginErr) {
			console.log('error');
			return next?.(loginErr);
		}
		const user: IIndexable = req.user;
		const payload: Login.Response = {
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
		req.login(user, loginFn); // not called automatically due to custom callback
	})(req, res, next);
};

export {
	login,
};