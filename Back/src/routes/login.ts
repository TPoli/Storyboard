import Account from "../models/account";
import Storyboard from "../storyboard"; '../storyboard';

export default (req: any, res: any, next: any) => {
	const login = (user: any, loginErr: any) => {
		if (loginErr) {
			console.log('error');
			return next(loginErr);
		}
		return res.send({ success : true, message : 'authentication succeeded' });
	};

	Storyboard.Instance().passport.authenticate('login', {session: true}, (err: Error, user: Account, info: any) => {
		if (err) {
			return next(err); // will generate a 500 error
		}
		if (! user) {
			return res.send({ success : false, message : 'authentication failed' }); // use IResponse, AuthFailResponse
		}
		req.login(user, login); // not called automatically due to custom callback
	})(req, res, next);
};