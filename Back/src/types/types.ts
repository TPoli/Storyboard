import * as express from 'express';
import Account from '../models/account';
import Transactions from '../models/transactions';

export type ExpressCallback = (req: express.Request, res: express.Response, next: express.NextFunction) => void;

export interface LoggedInRequest extends express.Request {
	transaction: Transactions,
	user: Account
};

export type ExpressFinalCallback = (req: LoggedInRequest, res: express.Response, next: express.NextFunction) => void;
