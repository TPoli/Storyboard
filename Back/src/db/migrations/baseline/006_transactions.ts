import { Column } from '../../../models';
import { createTable } from '../helpers/createTable';
import { Migration } from '../migration';
import tableData from './006_transactions.json';

class TransactionsTableMigration extends Migration {
	up: () => Promise<void|boolean> = async () => {
		console.log('upping transactions table Migration')
		await createTable('transactions', tableData as Column[], this.connection);
	};
	down: () => Promise<void|boolean> = async () => {
		return true;
	};
}

export default {
	TransactionsTableMigration,
}
