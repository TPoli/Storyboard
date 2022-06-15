import { passwordValidation, stringValidation, usernameValidation } from "../validation/validation";
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
	}, {
		name: 'email',
		validator: stringValidation,
		required: false,
		type: String,
	}, {
		name: 'mobile',
		validator: stringValidation,
		required: false,
		type: String,
	},
] as const;

const methods: RouteTypes[] = [ 'POST' ];

const routeDefinition = {
	path: 'createAccount',
	authenticatedUserRequired: false,
	params: params,
	methods: methods,
} as const;

type base = typeof params[number];
type Body = ParamBody<base>;

interface Response extends ISuccessResponse {};

export {
	Body,
	Response,
	routeDefinition,
}
