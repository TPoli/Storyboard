import { stringValidation, uuidValidation } from '../validation/validation';
import { ISuccessResponse, ParamBody, RouteTypes } from './types';

const params = [
	{
		name: 'uuid',
		validator: uuidValidation,
		required: true,
		type: String,
	},
	{
		name: 'parentId',
		validator: uuidValidation,
		required: false,
		type: String,
	},
	{
		name: 'title',
		validator: stringValidation,
		type: String,
	},
	{
		name: 'content',
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
	},
];

const methods: RouteTypes[] = [ 'POST' ];

const routeDefinition = {
	path: 'saveCollection',
	authenticatedUserRequired: true,
	params: params,
	methods:methods,
} as const;

type base = typeof params[number];
type Body = ParamBody<base>;

interface Response extends ISuccessResponse {
	message: 'Collection Saved';
}

export {
	Body,
	Response,
	routeDefinition,
}