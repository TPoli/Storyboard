import { EndpointRoutes, Api } from "../../../Core/Api/Api";
import createAccount from "./createAccount";
import login from "./login";
import { Route } from "./route";

type RouteMap = {
	[key in EndpointRoutes]: Route;
};

export const Routes: RouteMap = {
	createAccount: {
		callback: createAccount,
		params: Api.AllEndpoints['createAccount'].params
	},
	login: {
		callback: login,
		params: Api.AllEndpoints['login'].params
	},
	logout: {
		callback: (req: any, res: any) => {
			req.logout();
			res.send({ success : true, message : 'logged out' });
		},
		params: Api.AllEndpoints['logout'].params
	},
	test: {
		callback: (req: any, res: any) => {
			res.send('Well done!');
		},
		params: Api.AllEndpoints['test'].params
	}
};