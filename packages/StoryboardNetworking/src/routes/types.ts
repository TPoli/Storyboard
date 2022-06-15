import { ValidationCallback } from "../validation/validation";

type GenericObject = Record<string, unknown>;

type Parameter = {
	readonly name: string;
	readonly validator: ValidationCallback;
	readonly required?: boolean;
	readonly isArray?: boolean;
	readonly type: String | Object | Boolean | Number;
};

type RouteTypes = 'GET' | 'POST';

type KeysMatching<T, V> = {[K in keyof T]-?: T[K] extends V ? never : K}[keyof T];

type RouteBodyValueType<T extends {type: unknown}> = (
	T['type'] extends StringConstructor ? string
	: T['type'] extends BooleanConstructor ? boolean
	: T['type'] extends NumberConstructor ? number
	: GenericObject
);

type RouteBodyValueTypeArray<T extends {isArray?: boolean, type: unknown}> = (
	T['isArray'] extends true
	? RouteBodyValueType<T>[]
	: RouteBodyValueType<T>
);

type RouteBodyRequired<T extends { name: string, isArray?: boolean, type: unknown, required?: boolean }> = {
    [Member in T as Member["name"]]: Member['required'] extends true ? RouteBodyValueTypeArray<Member> : never;
}
type RouteBodyOptional<T extends { name: string, isArray?: boolean, type: unknown, required?: boolean }> = {
    [Member in T as Member["name"]]?: Member['required'] extends true ? never : RouteBodyValueTypeArray<Member>;
}

type ParamBody<T extends { name: string, type: unknown, required?: boolean }> = Pick<RouteBodyRequired<T>, KeysMatching<RouteBodyRequired<T>, never>> & Pick<RouteBodyOptional<T>, KeysMatching<RouteBodyOptional<T>, undefined>>;

interface IResponse {
	success: boolean;
	[keys: string]: any;
}
interface ISuccessResponse extends IResponse {
	success: true;
	message?: string;
}

interface IFailResponse extends IResponse {
	success: false;
	message: string;
	footerError?: string;
	headerError?: string;
}

interface IAuthFailResponse extends IFailResponse {
	message: 'authentication failed';
}

interface IAccountFailResponse extends IFailResponse {
	message: 'account creation failed';
}


interface ICollection {
	uuid: string,
	title: string,
	content: string,
	favourite: boolean,
}

export {
	ICollection,
	Parameter,
	RouteTypes,
	ParamBody,
	ISuccessResponse,
	IFailResponse,
	IAuthFailResponse,
	IAccountFailResponse,
	IResponse,
}
