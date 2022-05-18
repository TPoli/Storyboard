import { Column } from '../../../models';
import { createTable } from '../helpers/createTable';
import { Migration } from '../migration';
import tableData from './007_versions.json';

class VersionsTableMigration extends Migration {
	up: () => Promise<void|boolean> = async () => {
		console.log('upping versions table Migration')
		await createTable('versions', tableData as Column[], this.connection);
	};
	down: () => Promise<void|boolean> = async () => {
		return true;
	};
}

export default {
	VersionsTableMigration,
}
