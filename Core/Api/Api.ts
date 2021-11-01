import { ExpressCallback, LoggedInRequest } from '../../Back/src/types/types';
import { IAuthFailResponse } from '../types/Response';
import { passwordValidation, stringValidation, usernameValidation, ValidationCallback } from './Validation';

export type RequestMethods = 'POST' | 'GET';

export type EndpointRoutes = 'test' | 'login' | 'logout' | 'createAccount' | 'getCollections';
type EndpointMap = {[name: string]: EndpointRoutes};
export const Endpoints: EndpointMap = {
	TEST: 'test',
	LOGIN: 'login',
	LOGOUT: 'logout',
	CREATE_ACCOUNT: 'createAccount',
	GET_COLLECTIONS: 'getCollections',
};

export type Parameter = {
	name: string;
	required?: true;
	isArray?: boolean;
	validator: ValidationCallback;
};

type Endpoint = {
	route: EndpointRoutes;
	params: Parameter[];
	response: Parameter[];
	methods: RequestMethods[];
	middleware?:ExpressCallback
};

type EndpointCollection = {
	[key in EndpointRoutes]: Endpoint;
};

const authenticationMiddleware: ExpressCallback = (req, res, next) => {
    if ((req as LoggedInRequest).user) {
        return next()
    }
    const payload: IAuthFailResponse = {
        success: false,
        message: 'authentication failed',
    };
    res.send(payload);
};

namespace Api {
	export const testRoute: Endpoint = {
		route: Endpoints.TEST,
		params: [],
		response: [],
		methods: [ 'GET', 'POST', ],
		middleware: authenticationMiddleware,
	};

	export const logout: Endpoint = {
		route: Endpoints.LOGOUT,
		params: [],
		response: [],
		methods: [ 'GET', 'POST', ],
		middleware: authenticationMiddleware,
	};

	export const createAccount: Endpoint = {
		route: Endpoints.CREATE_ACCOUNT,
		params: [
			{
				name: 'un',
				validator: usernameValidation,
			},
			{
				name: 'pw',
				validator: passwordValidation,
			},
		],
		response: [],
		methods: [ 'POST', ],
	};

	export const login: Endpoint = {
		route: Endpoints.LOGIN,
		params: [
			{
				name: 'un',
				validator: usernameValidation,
			},
			{
				name: 'pw',
				validator: passwordValidation,
			},
		],
		response: [],
		methods: [ 'POST', ],
	};

	export const getCollections: Endpoint = {
		route: Endpoints.GET_COLLECTIONS,
		params: [
			{
				name: 'collections',
				isArray: true,
				validator: stringValidation,
			},
		],
		response: [],
		methods: [ 'POST', ],
	};

	export const AllEndpoints: EndpointCollection = {
		test: testRoute,
		createAccount: createAccount,
		login: login,
		logout: logout,
		getCollections,
	};
}

export { Api };
