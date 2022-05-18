import { Column } from '../../../models';
import { createTable } from '../helpers/createTable';
import { Migration } from '../migration';
import tableData from './001_migrations.json';

class MigrationsTableMigration extends Migration {
	up: () => Promise<void|boolean> = async () => {
		console.log('upping migrations table Migration')
		await createTable('migrations', tableData as Column[], this.connection);
	};
	down: () => Promise<void|boolean> = async () => {
		return true;
	};
}

export default {
	MigrationsTableMigration,
}
