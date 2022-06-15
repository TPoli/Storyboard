import { stringValidation, uuidValidation } from '../validation/validation';
import { ICollection, ISuccessResponse, ParamBody, RouteTypes } from './types';

const params = [
	{
		name: 'parentId',
		validator: uuidValidation,
		type: String,
	}, {
		name: 'name',
		validator: stringValidation,
		type: String,
	}, {
		name: 'description',
		validator: stringValidation,
		type: String,
	}, {
		name: 'after',
		validator: uuidValidation,
		type: String,
	}
] as const;

const methods: RouteTypes[] = [ 'POST' ];

const routeDefinition = {
	path: 'createCollection',
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
