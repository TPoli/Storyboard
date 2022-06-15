export * from './routes';
export * as CreateAccount from './createAccountRoute';
export * as CreateCollection from './createCollectionRoute';
export * as FavouriteCollection from './favouriteCollectionRoute';
export * as GetCollection from './getCollectionRoute';
export * as GetCollections from './getCollectionsRoute';
export * as Login from './loginRoute';
export * as Logout from './logoutRoute';
export * as SaveCollection from './saveCollectionRoute';

export {
	Parameter,
	RouteTypes,
	IAccountFailResponse,
	IAuthFailResponse,
	IFailResponse,
	ISuccessResponse,
	IResponse,
} from './types';