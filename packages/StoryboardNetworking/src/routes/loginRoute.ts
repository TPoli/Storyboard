import { passwordValidation, usernameValidation } from "../validation/validation";
import { ISuccessResponse, ParamBody, RouteTypes } from "./types";

const params = [
	{
		name: 'username',
		validator: usernameValidation,
		required: true,
		type: String,
	},
	{
		name: 'password',
		validator: passwordValidation,
		required: true,
		type: String,
	},
] as const;

const methods: RouteTypes[] = [ 'POST' ];

const routeDefinition = {
	path: 'login',
	authenticatedUserRequired: false,
	params: params,
	methods,
} as const;

type base = typeof params[number];
type Body = ParamBody<base>;

interface Response extends ISuccessResponse {
	username: string;
}

export {
	Body,
	Response,
	routeDefinition,
}
