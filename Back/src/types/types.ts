import { GenericObject } from 'core';
import * as express from 'express';
import {
	AccountAR,
	TransactionsAR,
} from '../models';

export type ExpressCallback = (req: express.Request, res: express.Response, next: express.NextFunction) => void;

export interface LoggedInRequest extends express.Request {
	transaction: TransactionsAR,
	user: AccountAR,
	body: GenericObject,
}

interface PayloadRequest<T> extends express.Request {
	transaction: TransactionsAR,
	user: AccountAR,
	body: T,
}

export type ExpressFinalCallback<T> = (req: PayloadRequest<T>, res: express.Response, next?: express.NextFunction) => void;
