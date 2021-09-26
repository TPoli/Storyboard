import { Parameter } from "../../../Core/Api/Api";
import { ExpressCallback } from "../types/types";

export type Route = {
	callback: ExpressCallback;
	params: Parameter[];
};