import { EndpointRoutes } from "../../../Core/Api/Api";
import createAccount from "./createAccount";
import login from "./login";

type ExpressCallback = (req: any, res: any, next?: any) => void;

type RouteMap = {
	[key in EndpointRoutes]: ExpressCallback;
};

export const Routes: RouteMap = {
	createAccount: createAccount,
	login: login,
	logout: (req: any, res: any) => {
		req.logout();
        res.send({ success : true, message : 'logged out' });
	},
	test: (req: any, res: any) => {
		res.send('Well done!');
	}
};