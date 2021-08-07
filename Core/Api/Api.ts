export type Endpoints = 'test';

type Parameter = {
	name: String;
	value: any;
	validator: (params: any) => Boolean;
};

type Endpoint = {
	route: Endpoints;
	params: Parameter[];
	response: Parameter[];
};

namespace Api {

	const testRoute = {
		route: 'test',
		params: [],
		response: [],
	} as Endpoint;

	export const AllEndpoints = [
		testRoute
	];

}

export { Api };
