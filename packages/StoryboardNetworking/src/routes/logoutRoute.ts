import { ISuccessResponse, ParamBody, Parameter, RouteTypes } from "./types";

const params: Parameter[] = [];

const methods: RouteTypes[] = [ 'GET', 'POST' ];

const routeDefinition = {
	path: 'logout',
	authenticatedUserRequired: true,
	params: params,
	methods: methods,
} as const;

type base = typeof params[number];
type Body = ParamBody<base>;

interface Response extends ISuccessResponse {}

export {
	Body,
	Response,
	routeDefinition,
}