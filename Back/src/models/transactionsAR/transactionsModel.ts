import { GenericObject } from 'core';
import { IResponse } from 'storyboard-networking';
import {
	ColumnType,
	Model,
} from '..';
import { houseAccountId } from '../accountAR';
import { column } from '../model/column';
import { TableNames } from '../tableNames';
import { Columns, TransactionsParams } from './types';

class TransactionsModel extends Model implements Columns {
	
	// metaData
	public version = 1;
	public table = TableNames.TRANSACTIONS;

	// columns
	@column({ primary: true, unique: true })
	public id: string;
	@column({ primary: true, references: {
		model: TableNames.ACCOUNT,
		column: 'id',
	}})
	public accountId: string = houseAccountId;
	@column({ })
	public route: string;
	@column({ taintable: true, type: ColumnType.JSON })
	public params: GenericObject;
	@column({ taintable: true, type: ColumnType.JSON })
	public response: IResponse;
	@column({ taintable: true })
	public ipAddress: string;

	constructor(params: TransactionsParams) {
		super();

		this.id = params.id ?? '';
		this.accountId = params.accountId ?? houseAccountId;
		this.route = params.route ?? '';
		this.params = params.params ?? {};
		this.response = params.response ?? { success: false };
		this.ipAddress = params.ipAddress ?? '';
	}
}

export {
	TransactionsModel,
};
