import { Parameter } from "../../../Core/Api/Api";

type ExpressCallback = (req: any, res: any, next?: any) => void;

export type Route = {
	callback: ExpressCallback;
	params: Parameter[];
};