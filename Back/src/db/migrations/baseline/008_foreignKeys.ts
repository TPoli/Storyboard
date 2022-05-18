import { setForeignKey } from '../helpers/setForeignKey';
import { ColumnRelation } from '../helpers/types';
import { Migration } from '../migration';

const tableData = [
    {
        "sourceTable": "collections",
        "sourceColumn": "parentId",
        "referencedTable": "collections",
        "referencedColumn": "id"
    },
    {
        "sourceTable": "permissions",
        "sourceColumn": "collectionId",
        "referencedTable": "collections",
        "referencedColumn": "id"
    },
    {
        "sourceTable": "permissions",
        "sourceColumn": "accountId",
        "referencedTable": "account",
        "referencedColumn": "id"
    },
    {
        "sourceTable": "transactions",
        "sourceColumn": "accountId",
        "referencedTable": "account",
        "referencedColumn": "id"
    }
];

class CreateForeignKeysMigration extends Migration {
	up: () => Promise<void|boolean> = async () => {
		console.log('linking tables');
		for (const data of tableData) {
			await setForeignKey(data as unknown as ColumnRelation, this.connection);
		}
		
	};
	down: () => Promise<void|boolean> = async () => {
		return true;
	};
}

export default {
	CreateForeignKeysMigration,
}
