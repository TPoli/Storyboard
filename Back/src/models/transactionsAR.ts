import * as express from 'express';

import {
	Model,
	Column,
	ColumnType,
	AccountAR
} from './';
import { IResponse } from '../../../Core/types/Response';
import { LoggedInRequest } from '../types/types';
import { houseAccountId } from './accountAR';
import { TableNames } from './tableNames';

export class TransactionsAR extends Model {
	
	public version = 1;
	public table = TableNames.TRANSACTIONS;
	public columns = [
		{
			name: 'id',
			primary: true,
			taintable: false,
			type: ColumnType.INT,
			autoIncrement: true,
			nullable: false,
			unique: true,
		}, {
			name: 'account',
			primary: true,
			taintable: false,
			type: ColumnType.STRING,
			references: {
				model: new AccountAR().table,
				column: 'id',
			},
		}, {
			name: 'route',
			primary: false,
			taintable: false,
			type: ColumnType.STRING,
			nullable: false,
		}, {
			name: 'ipAddress',
			primary: false,
			taintable: true,
			type: ColumnType.STRING,
			nullable: false,
		}, {
			name: 'params',
			primary: false,
			taintable: true,
			type: ColumnType.JSON,
			nullable: false,
		}, {
			name: 'response',
			primary: false,
			taintable: true,
			type: ColumnType.JSON,
		},
	] as Column[];

	public account = houseAccountId;
	public route = '';
	public params: Object = {};
	public response: Object|null = null;
	public ipAddress = '';

	constructor() {
		super();
	}

	public sendResponse = (response: express.Response, req: LoggedInRequest|null, payload: IResponse) => {
		response.send(payload); // dont wait for db to resolve to respond to user

		this.response = payload;
		this.save(req, ['response',]);
	}
}