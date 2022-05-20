import { Column } from '../../../models';
import { createTable } from '../helpers/createTable';
import { Migration } from '../migration';
import tableData from './004_mutations.json';

class MutationsTableMigration extends Migration {
	
	protected _alwaysRun = true;

	_up: () => Promise<void|boolean> = async () => {
		console.log('upping mutations table Migration')
		await createTable('mutations', tableData as Column[], this.connection);
	};
	_down: () => Promise<void|boolean> = async () => {
		return true;
	};
}

export default {
	MutationsTableMigration,
}