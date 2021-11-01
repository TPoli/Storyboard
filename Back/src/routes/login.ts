import AccountAR from '../models/accountAR';
import Storyboard from '../storyboard';
import { IAuthFailResponse, ILoginResponse } from '../../../Core/types/Response'
import { IIndexable } from '../models/model';
import { ExpressFinalCallback } from '../types/types';

const loginFn: ExpressFinalCallback = (req, res, next) => {
	const login = (loginErr: any) => {
		if (loginErr) {
			console.log('error');
			return next(loginErr);
		}
		const user: IIndexable = req.user;
		const payload: ILoginResponse = {
			success: true,
			username: user.username,
		};
		return req.transaction.sendResponse(res, payload);
	};

	Storyboard.Instance().passport.authenticate('login', {session: true,}, (err: Error, user: AccountAR, info: any) => {
		if (err) {
			return next(err); // will generate a 500 error
		}
		if (!user) {
			const payload: IAuthFailResponse = {
				success: false,
				message: 'authentication failed',
			};
			req.transaction.sendResponse(res, payload);
		}
		req.login(user, login); // not called automatically due to custom callback
	})(req, res, next);
};

export default loginFn;