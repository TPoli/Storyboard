import { ICollection } from "./Collection";

export interface IResponse {
	success: boolean;
}

export interface IFailResponse extends IResponse {
	success: false;
	message: string;
	footerError?: string;
	headerError?: string;
}

export interface ISuccessResponse extends IResponse {
	success: true;
	message?: string;
}

export interface IAuthFailResponse extends IFailResponse {
	message: 'authentication failed';
}

export interface IAccountFailResponse extends IFailResponse {
	message: 'account creation failed';
}

export interface ILoginResponse extends ISuccessResponse {
	username: string;
}

export interface IGetCollectionsPayload {
	[keys: string]: ICollection[]
}
export interface IGetCollectionsResponse extends ISuccessResponse {
	collections: IGetCollectionsPayload;
}

export interface ICreateCollectionResponse extends ISuccessResponse {
	newCollection: ICollection;
}

export interface IFavouriteCollectionResponse extends ISuccessResponse {
	collectionId: String;
	favourite: boolean;
}

export interface ISaveCollectionResponse extends ISuccessResponse {
	message: 'Collection Saved';
}

export type Response = ISuccessResponse | IAuthFailResponse | IAccountFailResponse | ILoginResponse | IGetCollectionsResponse | ICreateCollectionResponse | ISaveCollectionResponse | IFavouriteCollectionResponse;

export interface IDataResponse {
	data: Response;
}
