import { Migration } from '../migration';

class MigrationsTableMigration extends Migration {
	up: () => Promise<void|boolean> = async () => {
		console.log('upping migrations table Migration')
	};
	down: () => Promise<void|boolean> = async () => {
		return true;
	};
}

export default {
	MigrationsTableMigration,
}
