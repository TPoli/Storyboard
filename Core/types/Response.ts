import { ICollection } from "./Collection";

export interface IResponse {
	success: boolean;
};

export interface IFailResponse extends IResponse {
	success: false;
	message: string;
	footerError?: string;
	headerError?: string;
};

export interface ISuccessResponse extends IResponse {
	success: true;
	message?: string;
};

export interface IAuthFailResponse extends IFailResponse {
	message: 'authentication failed';
};

export interface IAccountFailResponse extends IFailResponse {
	message: 'account creation failed';
};

export interface ILoginResponse extends ISuccessResponse {
	username: string;
};

export interface IGetCollectionsResponse extends ISuccessResponse {
	collections: {
		[keys: string]: ICollection[]
	};
};

export type Response = ISuccessResponse | IAuthFailResponse | IAccountFailResponse | ILoginResponse;

export interface IDataResposne {
	data: Response;
};
