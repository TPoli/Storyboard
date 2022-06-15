
import * as CreateAccount from './createAccountRoute';
import * as FavouriteCollection from './favouriteCollectionRoute';
import * as CreateCollection from './createCollectionRoute';
import * as GetCollection from './getCollectionRoute';
import * as GetCollections from './getCollectionsRoute';
import * as Login from './loginRoute';
import * as Logout from './logoutRoute';
import * as SaveCollection from './saveCollectionRoute';
import { Parameter, RouteTypes } from './types';

const allRoutesBase = [
	CreateAccount,
	CreateCollection,
	FavouriteCollection,
	GetCollection,
	GetCollections,
	Login,
	Logout,
	SaveCollection,
] as const;

type AllRoutePayloads = (
	CreateAccount.Body |
	CreateCollection.Body |
	FavouriteCollection.Body |
	GetCollection.Body |
	Login.Body |
	Logout.Body |
	SaveCollection.Body
);

const allRouteDefinitions = allRoutesBase.map(r => r.routeDefinition);

type RouteNames = typeof allRouteDefinitions[number]['path'];

type Route = {
	readonly path: RouteNames;
	readonly authenticatedUserRequired: boolean;
	readonly params: readonly Parameter[];
	readonly methods: RouteTypes[];
};

const AllRoutes: readonly Route[] = allRouteDefinitions;

export {
	AllRoutePayloads,
	AllRoutes,
	Route,
	RouteNames,
}
