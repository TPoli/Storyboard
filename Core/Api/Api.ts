export type RequestMethods = 'POST' | 'GET';
export enum Endpoints {
	TEST = 'test',
	LOGIN = 'login',
	LOGOUT = 'logout',
	CREATE_ACCOUNT = 'createAccount'
};

type Parameter = {
	name: String;
	value: any;
	validator: (params: any) => Boolean;
};

type Endpoint = {
	route: Endpoints;
	params: Parameter[];
	response: Parameter[];
	methods: RequestMethods[]
};

type EndpointCollection = {
	[key in Endpoints]: Endpoint;
};

namespace Api {

	const testRoute = {
		route: Endpoints.TEST,
		params: [],
		response: [],
		methods: [ 'GET', 'POST' ]
	} as Endpoint;

	export const AllEndpoints = {
		test: testRoute
	} as EndpointCollection;
}

export { Api };
