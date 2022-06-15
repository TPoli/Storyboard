import { uuidValidation } from '../validation/validation';
import { ICollection, ISuccessResponse, ParamBody, RouteTypes } from './types';

const params = [
	{
		name: 'collectionId',
		validator: uuidValidation,
		type: String,
	},
];

const methods: RouteTypes[] = [ 'POST' ];

const routeDefinition = {
	path: 'getCollection',
	authenticatedUserRequired: true,
	params: params,
	methods: methods,
} as const;

type base = typeof params[number];
type Body = ParamBody<base>;

interface Response extends ISuccessResponse {
	newCollection: ICollection;
}

export {
	Body,
	Response,
	routeDefinition,
}
