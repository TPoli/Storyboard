import { Column } from '../../../models';
import { createTable } from '../helpers/createTable';
import { Migration } from '../migration';
import tableData from './MIGRATIONNAME.json';

class CLASSNAME extends Migration {
	up: () => Promise<void|boolean> = async () => {
		console.log('upping TABLENAME table Migration')
		await createTable('TABLENAME', tableData as Column[], this.connection);
	};
	down: () => Promise<void|boolean> = async () => {
		return true;
	};
}

export default {
	CLASSNAME,
}
