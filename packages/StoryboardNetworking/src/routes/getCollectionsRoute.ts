import { stringValidation, uuidValidation } from '../validation/validation';
import { ICollection, ISuccessResponse, ParamBody, RouteTypes } from './types';

const params = [
	{
		name: 'collections',
		isArray: true,
		validator: stringValidation,
		type: String,
	},
	{
		name: 'parentId',
		validator: uuidValidation,
		type: String,
	},
] as const;

const methods: RouteTypes[] = [ 'POST' ];

const routeDefinition = {
	path: 'getCollections',
	authenticatedUserRequired: true,
	params: params,
	methods: methods,
} as const;

type base = typeof params[number];
type Body = ParamBody<base>;

interface IGetCollectionsPayload {
	[keys: string]: ICollection[]
}

interface Response extends ISuccessResponse {
	collections: IGetCollectionsPayload;
}

export {
	Body,
	Response,
	routeDefinition,
	IGetCollectionsPayload as Payload,
}
