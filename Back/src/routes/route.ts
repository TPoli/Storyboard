import { Parameter } from '../../../packages/core/src/Api/Api';
import { ExpressFinalCallback } from '../types/types';

export type Route = {
	callback: ExpressFinalCallback;
	params: Parameter[];
	authenticatedUserRequired: boolean;
};