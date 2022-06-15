import { AllRoutePayloads, RouteNames } from 'storyboard-networking';
import {
	createAccount,
	createCollections,
	favouriteCollection,
	getCollection,
	getCollections,
	login,
	logoutHandler,
	saveCollections,
} from '../routes';
import { ExpressFinalCallback } from '../types/types';

type HandlerMap = {
    [key in RouteNames]: ExpressFinalCallback<AllRoutePayloads>;
};

const endpointHandlers: HandlerMap = {
	createAccount: createAccount,
	createCollection: createCollections,
	favouriteCollection: favouriteCollection,
	getCollection: getCollection,
    getCollections: getCollections,
    login: login,
    logout: logoutHandler,
    saveCollection: saveCollections,
};

export {
	endpointHandlers,
}
