
export interface IResponse {
	success: boolean;
};

export interface IFailResponse extends IResponse {
	success: false;
	message: string;
};

export interface ISuccessResponse extends IResponse {
	success: true;
};

export interface IAuthFailResponse extends IFailResponse {
	message: 'authentication failed';
};

export interface IAccountFailResponse extends IFailResponse {
	message: 'account creation failed';
};

export type Response = ISuccessResponse | IAuthFailResponse | IAccountFailResponse;

export interface IDataResposne {
	data: Response;
};
