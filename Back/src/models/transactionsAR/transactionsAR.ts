import * as express from 'express';

import {
	Model,
	Column,
	ColumnType
} from '..';
import { IResponse } from '../../../../Core/types/Response';
import { LoggedInRequest } from '../../types/types';
import { TransactionsModel, TransactionsModelParams } from './transactionsModel';

export class TransactionsAR extends TransactionsModel {

	public sendResponse = (response: express.Response, req: LoggedInRequest|null, payload: IResponse) => {
		response.send(payload); // dont wait for db to resolve to respond to user

		this.response = payload;
		this.save(req, ['response',]);
	}

	constructor(params: TransactionsModelParams) {
		super(params);
	}
}