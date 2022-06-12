import * as mysqlPromise from 'mysql2/promise';
import { getConfig } from '../../../main';
import { Column } from '../../../models';

const config = getConfig();

const getPrimaryKeys = (columns: Column[]) => {
	return columns.filter((column: Column) => column.primary).map(column => column.name);
}

const getUniqueKeys = (columns: Column[]) => {
	return columns.filter((column: Column) => column.unique).map(column => column.name);
}

const getColumnFragment = (column: Column) => {
	const columnFragments: string[] = [
		'\t' + column.name + ' ' + column.type,
	];
	if (!column.nullable) {
		columnFragments.push(' NOT');
	}

	columnFragments.push(' NULL');

	if (column.autoIncrement) {
		columnFragments.push(' AUTO_INCREMENT');
	}

	columnFragments.push(',\n');

	return columnFragments.join('');
}

// create table statically using provided data
const createTable = async (tableName: string, columns: Column[], connection: mysqlPromise.Connection) => {
	console.log(`Creating table ${tableName}`);

	if (!config) {
		throw new Error('missing database config');
	}

	const primaryKeys = getPrimaryKeys(columns);
	const uniqueKeys = getUniqueKeys(columns);

	const queryFragments = [
		`CREATE TABLE IF NOT EXISTS \`${config.dbName}\`.\`${tableName}\` (\n`,
	];

	columns.forEach((column: Column) => {
		queryFragments.push(getColumnFragment(column));
	});

	queryFragments.push(`PRIMARY KEY (${primaryKeys.join(',')})`);

	// set indexes
	uniqueKeys.forEach((key: string) => {
		queryFragments.push(`,\nUNIQUE INDEX ${key + '_UNIQUE'} (${key} ASC) VISIBLE`);
	});

	queryFragments.push(')');

	try {
		return connection.query(queryFragments.join(''));
	} catch (error) {
		throw error;
	}
};

export {
	createTable,
}
