import * as express from 'express';

import { IResponse } from '../../../../Core/types/Response';
import { LoggedInRequest } from '../../types/types';
import { TransactionsParams } from './types';
import { TransactionsModel } from './transactionsModel';

export class TransactionsAR extends TransactionsModel {
	public sendResponse = (response: express.Response, req: LoggedInRequest|null, payload: IResponse) => {
		response.send(payload); // dont wait for db to resolve to respond to user

		this.response = payload || {};
		this.save<TransactionsAR>(req, ['response',]);
	}

	constructor(params: TransactionsParams) {
		super(params);
	}
}
