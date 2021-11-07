import { EndpointRoutes, Api } from '../../../Core/Api/Api';
import { ISuccessResponse } from '../../../Core/types/Response';
import createAccount from './createAccount';
import createCollectionsFn from './createCollections';
import getCollectionsFn from './getCollections';
import loginFn from './login';
import { Route } from './route';

type RouteMap = {
	[key in EndpointRoutes]: Route;
};

export const Routes: RouteMap = {
	createAccount: {
		callback: createAccount,
		params: Api.AllEndpoints['createAccount'].params,
		authenticatedUserRequired: false,
	},
	login: {
		callback: loginFn,
		params: Api.AllEndpoints['login'].params,
		authenticatedUserRequired: false,
	},
	logout: {
		callback: (req, res) => {
			req.logout();
			const payload: ISuccessResponse = {
				success: true,
				message: 'logged out',
			};
			req.transaction.sendResponse(res, payload);
		},
		params: Api.AllEndpoints['logout'].params,
		authenticatedUserRequired: false,
	},
	test: {
		callback: (req, res) => {
			const payload: ISuccessResponse = {
				success: true,
				message: 'Well done!',
			};
			req.transaction.sendResponse(res, payload);
		},
		params: Api.AllEndpoints['test'].params,
		authenticatedUserRequired: true,
	},
	getCollections: {
		callback: getCollectionsFn,
		params: Api.AllEndpoints['getCollections'].params,
		authenticatedUserRequired: true,
	},
	createCollection: {
		callback: createCollectionsFn,
		params: Api.AllEndpoints['createCollection'].params,
		authenticatedUserRequired: true,
	},
};