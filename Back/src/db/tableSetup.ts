import { RowDataPacket } from 'mysql2/promise';
import { CamelCase } from '../../../Core/Utils/Utils';
import { AccountAR, CollectionAR, Column, MutationsAR, TransactionsAR, VersionsAR, PermissionsAR } from '../models';
import { Schema } from '../models/schema';
import { dbName } from './config';
import { AdminConnection } from './db';

const schemas = [
	VersionsAR,
	MutationsAR,
	AccountAR,
	TransactionsAR,
	CollectionAR,
	PermissionsAR,
] as Schema[];

export const ensureTablesSetup = async () => {

	const versions = new VersionsAR({});
	const versionsTableExists = await tableExists(versions.table);
	if (!versionsTableExists) {
		await createTable(VersionsAR);
	}

	const mutations = new MutationsAR({});
	const mutationsTableExists = await tableExists(mutations.table);
	if (!mutationsTableExists) {
		await createTable(MutationsAR);
	}

	return checkTheRestOfTheTables();
};

const checkTheRestOfTheTables = async () => {
	const newSchemas: Schema[] = [];

	for (const schema of schemas) {
		const model = new schema({});
		const exists = await tableExists(model.table);

		if (!exists) {
			newSchemas.push(schema);
			await createTable(schema);
		}
		// TODO should check version + run migrations
	}

	return ensureForeignKeysSet(newSchemas);
};

const createTable = async (schema: Schema) => {
	const model = new schema({});
	console.log(`Creating table ${model.table}`);
	let createQuery = `CREATE TABLE \`${dbName}\`.\`${model.table}\` (`;
	const primaryKeys: string[] = [];
	const uniqueKeys: string[] = [];
	model.columns.forEach((column: Column) => {
		createQuery += column.name + ' ' + column.type;
		if (column.primary == true) {
			primaryKeys.push(column.name);
		}
		if (column.unique) {
			uniqueKeys.push(column.name);
		}
		if (!column.nullable) {
			createQuery += ' NOT';
		}
		createQuery += ' NULL';

		if (column.autoIncrement) {
			createQuery += ' AUTO_INCREMENT';
		}

		createQuery += ',\n';
	});
	
	createQuery += `PRIMARY KEY (${primaryKeys.join(',')})`;

	// set indexes
	uniqueKeys.forEach((key: string) => {
		createQuery += `,\nUNIQUE INDEX ${key + '_UNIQUE'} (${key} ASC) VISIBLE`;
	});

	model.columns.forEach((column: Column) => {
		if (column.references) {
			createQuery += `,\nINDEX(${column.name})`;
		}
	});

	createQuery += ')';

	try {
		await AdminConnection().query(createQuery);
		return model.createDefaultEntries();
	} catch (error) {
		throw error;
	}
};

const tableExists = async (tableName: string): Promise<boolean> => {
	const existsQuery = `
		SELECT * FROM information_schema.tables
		WHERE table_schema = ?
			AND table_name = ?
		LIMIT 1;
	`;

	try {
		const results = await AdminConnection().query(existsQuery, [dbName, tableName,]) as RowDataPacket[][];
		return !!(results[0]?.length ?? false);
	} catch (error) {
		throw error;
	}
};

const ensureForeignKeysSet = async (newSchemas: Schema[]) => {
	for (const schema of newSchemas) {
		await setForeignKeys(schema);
	}

	return;
};

const setForeignKeys = async (schema: Schema) => {
	const foreignKeyColumns: Column[] = [];

	const model = new schema({});

	model.columns.forEach((column: Column) => {
		if (column.references) {
			foreignKeyColumns.push(column);
		}
	});

	if (foreignKeyColumns.length === 0) {
		return;
	}

	const tableName = `${dbName}.${model.table}`;

	let sql = `ALTER TABLE ${tableName}`;
	let first = true;

	foreignKeyColumns.forEach((column: Column) => {
		if (!column.references) {
			return;
		}
		const referencedTableName = `${dbName}.${column.references.model}`;

		const fkName = CamelCase([model.table, column.references.model, column.name, '_', column.references.column, 'Fk', ]);
		sql += `${(first ? '' : ',')}\nADD CONSTRAINT ${fkName}\n`;
		sql += `FOREIGN KEY (${column.name})\n`;
		sql += `REFERENCES ${referencedTableName} (${column.references.column})\n`;
		sql += 'ON UPDATE NO ACTION ON DELETE NO ACTION';
		first = false;
	});

	try {
		await AdminConnection().query(sql);
		return await model.createDefaultEntries();
	} catch (error) {
		throw error;
	}
};