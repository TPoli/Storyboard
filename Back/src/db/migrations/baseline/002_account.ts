import { Column } from '../../../models';
import { createTable } from '../helpers/createTable';
import { Migration } from '../migration';
import tableData from './002_account.json';

class AccountTableMigration extends Migration {
	up: () => Promise<void|boolean> = async () => {
		console.log('upping account table Migration')
		await createTable('account', tableData as Column[], this.connection);
	};
	down: () => Promise<void|boolean> = async () => {
		return true;
	};
}

export default {
	AccountTableMigration,
}
