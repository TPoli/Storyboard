import * as express from 'express';
import {
	AccountAR,
	TransactionsAR
} from '../models';

export type ExpressCallback = (req: express.Request, res: express.Response, next: express.NextFunction) => void;

export interface LoggedInRequest extends express.Request {
	transaction: TransactionsAR,
	user: AccountAR
}

export type ExpressFinalCallback = (req: LoggedInRequest, res: express.Response, next?: express.NextFunction) => void;
