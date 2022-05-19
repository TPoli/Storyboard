import { setForeignKey } from '../helpers/setForeignKey';
import { ColumnRelation } from '../helpers/types';
import { Migration } from '../migration';

const tableData = ['DATA'];

class CreateForeignKeysMigration extends Migration {

	protected _alwaysRun = true;

	_up: () => Promise<void|boolean> = async () => {
		console.log('linking tables');
		for (const data of tableData) {
			await setForeignKey(data as unknown as ColumnRelation, this.connection);
		}
		
	};
	_down: () => Promise<void|boolean> = async () => {
		return true;
	};
}

export default {
	CreateForeignKeysMigration,
}
