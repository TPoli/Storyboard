import * as mysqlPromise from 'mysql2/promise';
import { ColumnRelation } from './types';

const setForeignKey = async (column: ColumnRelation, connection: mysqlPromise.Connection) => {

	const foreignKey = `FK_${column.sourceTable}_${column.sourceColumn}_${column.referencedTable}_${column.referencedColumn}`;

	const existsQuery = `
		SELECT COUNT(*) AS fkExists
			FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
			WHERE CONSTRAINT_NAME ='${foreignKey}'
	`;

	const query = `
		ALTER TABLE ${column.sourceTable}
		ADD CONSTRAINT ${foreignKey}
		FOREIGN KEY(${column.sourceColumn})
		REFERENCES ${column.referencedTable}(${column.referencedColumn})
	`;

	try {
		const exists = await connection.query(existsQuery);
		if (exists[0][0]['fkExists'] === 0) {
			return connection.execute(query);
		}
	} catch (error) {
		throw error;
	}
};

export {
	setForeignKey,
}
