import { booleanValidation, uuidValidation } from "../validation/validation";
import {
	ISuccessResponse,
	ParamBody,
	Parameter,
	RouteTypes
} from "./types";

const params = [
	{
		name: 'uuid',
		validator: uuidValidation,
		type: String,
		required: true,
	},
	{
		name: 'favourite',
		validator: booleanValidation,
		type: Boolean,
		required: true,
	},
] as const;

const routeParams: readonly Parameter[] = params;

type base = typeof params[number];
type Body = ParamBody<base>;

const methods: RouteTypes[] = [ 'POST' ];

const routeDefinition = {
	path: 'favouriteCollection',
	authenticatedUserRequired: true,
	params: routeParams,
	methods: methods,
} as const;

interface Response extends ISuccessResponse {
	collectionId: String;
	favourite: boolean;
}

export {
	Body,
	Response,
	routeDefinition,
}
