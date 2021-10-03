import Storyboard from '../storyboard';
import AccountAR from '../models/accountAR';
import { IAccountFailResponse, ILoginResponse } from '../../../Core/types/Response';

export default (req: any, res: any, next: any) => {
	const loginCallback = (loginErr: any) => {
		if (loginErr) {
			console.log('error');
			return next(loginErr);
		}
		const response: ILoginResponse = {
			success: true,
			username: (req.user as AccountAR).username
		};
		
		return req.transaction.sendResponse(res, response);
	};

	Storyboard.Instance().passport.authenticate('createAccount', {session: true}, (err: Error, user: AccountAR, info: any) => {
		if (err) {
			return next(err); // will generate a 500 error
		}
		if (!user) {
			const payload: IAccountFailResponse = {
				success: false,
				message: 'account creation failed'
			};
			req.transaction.sendResponse(res, payload);
		}
		req.login(user, loginCallback); // not called automatically due to custom callback
	})(req, res, next);
};