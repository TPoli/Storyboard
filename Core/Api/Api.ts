import { IAuthFailResponse } from '../types/Response';
import { passwordValidation, usernameValidation, ValidationCallback } from './Validation';

export type RequestMethods = 'POST' | 'GET';

export type EndpointRoutes = 'test' | 'login' | 'logout' | 'createAccount';
type EndpointMap = {[name: string]: EndpointRoutes};
export const Endpoints: EndpointMap = {
	TEST: 'test',
	LOGIN: 'login',
	LOGOUT: 'logout',
	CREATE_ACCOUNT: 'createAccount'
};

export type Parameter = {
	name: string;
	required?: true;
	validator: ValidationCallback;
};

type Endpoint = {
	route: EndpointRoutes;
	params: Parameter[];
	response: Parameter[];
	methods: RequestMethods[];
	middleware?: (req: any, res: any, next: any) => void;
};

type EndpointCollection = {
	[key in EndpointRoutes]: Endpoint;
};

const authenticationMiddleware = (req: any, res: any, next: any) => {
    if (req.user) {
        return next()
    }
    const payload: IAuthFailResponse = {
        success: false,
        message: 'authentication failed'
    };
    res.send(payload);
};

namespace Api {
	export const testRoute: Endpoint = {
		route: Endpoints.TEST,
		params: [],
		response: [],
		methods: [ 'GET', 'POST' ],
		middleware: authenticationMiddleware
	};

	export const logout: Endpoint = {
		route: Endpoints.LOGOUT,
		params: [],
		response: [],
		methods: [ 'GET', 'POST' ],
		middleware: authenticationMiddleware
	};

	export const createAccount: Endpoint = {
		route: Endpoints.CREATE_ACCOUNT,
		params: [
			{
				name: 'un',
				validator: usernameValidation
			},
			{
				name: 'pw',
				validator: passwordValidation
			},
		],
		response: [],
		methods: [ 'POST' ],
	};

	export const login: Endpoint = {
		route: Endpoints.LOGIN,
		params: [
			{
				name: 'un',
				validator: usernameValidation
			},
			{
				name: 'pw',
				validator: passwordValidation
			},
		],
		response: [],
		methods: [ 'POST' ],
	};

	export const AllEndpoints: EndpointCollection = {
		test: testRoute,
		createAccount: createAccount,
		login: login,
		logout: logout
	};
}

export { Api };
