import * as express from 'express';
import { GenericObject } from '../types';

export type ExpressCallback = (req: express.Request, res: express.Response, next: express.NextFunction) => void;

export interface LoggedInRequest extends express.Request {
	transaction: any, // TransactionsAR
	user: any, // AccountAR
	body: GenericObject,
}

export type ExpressFinalCallback = (req: LoggedInRequest, res: express.Response, next?: express.NextFunction) => void;
