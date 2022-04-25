import {
	Model
} from '..';
import { houseAccountId } from '../accountAR';
import { TableNames } from '../tableNames';
import { ColumnDefinitions, columns, TransactionsModelParams } from './columns';

class TransactionsModel extends Model implements ColumnDefinitions {
	
	// metaData
	public version = 1;
	public table = TableNames.TRANSACTIONS;

	// columns
	public id: string;
	public accountId = houseAccountId;
	public route: string;
	public params: Object;
	public response: Object;
	public ipAddress = '';
	public columns = columns;

	constructor(params: TransactionsModelParams) {
		super();

		this.id = params.id ?? '';
		this.accountId = params.accountId ?? houseAccountId;
		this.route = params.route ?? '';
		this.params = params.params ?? {};
		this.response = params.response ?? {};
		this.ipAddress = params.ipAddress ?? '';
	}
}

export {
	TransactionsModel,
};
