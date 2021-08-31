import Storyboard from '../storyboard';
import Account from '../models/account';
import { IAccountFailResponse } from '../../../Core/types/Response';

export default (req: any, res: any, next: any) => {
	const loginCallback = (user: any, loginErr: any) => {
		if (loginErr) {
			console.log('error');
			return next(loginErr);
		}
		return res.send({ success : true, message : 'account created' });
	};

	Storyboard.Instance().passport.authenticate('createAccount', {session: true}, (err: Error, user: Account, info: any) => {
		if (err) {
			return next(err); // will generate a 500 error
		}
		if (! user) {
			return res.send({ success : false, message : 'account creation failed' } as IAccountFailResponse);
		}
		req.login(user, loginCallback); // not called automatically due to custom callback
	})(req, res, next);
};