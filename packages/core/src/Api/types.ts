import * as express from 'express';

export type ExpressCallback = (req: express.Request, res: express.Response, next: express.NextFunction) => void;

export interface LoggedInRequest extends express.Request {
	transaction: any, // TransactionsAR
	user: any, // AccountAR
}

export type ExpressFinalCallback = (req: LoggedInRequest, res: express.Response, next?: express.NextFunction) => void;
