import * as express from 'express';
import AccountAR from '../models/accountAR';
import TransactionsAR from '../models/transactionsAR';

export type ExpressCallback = (req: express.Request, res: express.Response, next: express.NextFunction) => void;

export interface LoggedInRequest extends express.Request {
	transaction: TransactionsAR,
	user: AccountAR
}

export type ExpressFinalCallback = (req: LoggedInRequest, res: express.Response, next?: express.NextFunction) => void;
