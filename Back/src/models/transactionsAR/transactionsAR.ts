import * as express from 'express';

import { IResponse } from 'core';
import { LoggedInRequest } from '../../types/types';
import { TransactionsParams } from './types';
import { TransactionsModel } from './transactionsModel';

export class TransactionsAR extends TransactionsModel {
	public sendResponse = (response: express.Response, req: LoggedInRequest|null, payload: IResponse): void => {
		response.send(payload); // dont wait for db to resolve to respond to user

		this.response = payload || { success: false };
		this.save<TransactionsAR>(req, ['response']);
	}

	constructor(params: TransactionsParams) {
		super(params);
	}
}
