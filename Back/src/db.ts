import * as mysql from 'mysql2';
import * as mysqlPromise from 'mysql2/promise';

import { CamelCase } from '../../Core/Utils/Utils';
import { Schema } from './models/schema';
import {
	CollectionAR,
	MutationsAR,
	TransactionsAR,
	AccountAR,
	VersionsAR,
	RecentCollectionsAR,
	Column
} from './models';
import { OkPacket, RowDataPacket } from 'mysql2/promise';

export namespace Db {

	const databaseName = 'storyboard';

	export type DbCallback = (error: mysql.QueryError | null, results: any[], fields:  mysql.FieldPacket[]) => void;
	export const schemas = [
		// Versions,
		// Mutations,
		AccountAR,
		TransactionsAR,
		CollectionAR,
		RecentCollectionsAR,
	] as Schema[];

	let defaultConnection: mysql.Connection|null = null;
	let defaultPromiseConnection: mysqlPromise.Connection|null = null;
	let adminConnection: mysqlPromise.Connection|null = null;

	const setForeignKeys = async (schema: Schema) => {
		if (!adminConnection) {
			throw new Error('admin database connection not established');
		}

		const foreignKeyColumns: Column[] = [];

		const model = new schema();

		model.columns.forEach((column: Column) => {
			if (column.references) {
				foreignKeyColumns.push(column);
			}
		});

		if (foreignKeyColumns.length === 0) {
			return;
		}

		const tableName = `${databaseName}.${model.table}`;

		let sql = `ALTER TABLE ${tableName}`;
		let first = true;

		foreignKeyColumns.forEach((column: Column) => {
			if (!column.references) {
				return;
			}
			const referencedTableName = `${databaseName}.${column.references.model}`;

			const fkName = CamelCase([model.table, column.references.model, column.name, '_', column.references.column, 'Fk', ]);
			sql += `${(first ? '' : ',')}\nADD CONSTRAINT ${fkName}\n`;
			sql += `FOREIGN KEY (${column.name})\n`;
			sql += `REFERENCES ${referencedTableName} (${column.references.column})\n`;
			sql += 'ON UPDATE NO ACTION ON DELETE NO ACTION';
			first = false;
		});

		try {
			await adminConnection.query(sql);
			return await model.createDefaultEntries();
		} catch (error) {
			throw error;
		}
	};

	const createTable = async (schema: Schema) => {
		if (!adminConnection) {
			throw new Error('admin database connection not established');
		}

		const model = new schema();
		console.log(`Creating table ${model.table}`);
		let createQuery = `CREATE TABLE \`${databaseName}\`.\`${model.table}\` (`;
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
			await adminConnection.query(createQuery);
			return model.createDefaultEntries();
		} catch (error) {
			throw error;
		}
	};

	const tableExists = async (tableName: string): Promise<boolean> => {
		if (!adminConnection) {
			throw new Error('admin database connection not established');
		}
		const existsQuery = `
			SELECT * FROM information_schema.tables
			WHERE table_schema = ?
				AND table_name = ?
			LIMIT 1;
		`;

		try {
			const results = await adminConnection.query(existsQuery, [databaseName, tableName,]) as RowDataPacket[][];
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

	const checkTheRestOfTheTables = async () => {
		const newSchemas: Schema[] = [];

		for (const schema of schemas) {
			const model = new schema();
			const exists = await tableExists(model.table);

			if (!exists) {
				newSchemas.push(schema);
				await createTable(schema);
			}
			// TODO should check version + run migrations
		}

		return ensureForeignKeysSet(newSchemas);
	};

	const ensureTablesSetup = async () => {

		const versionsTableExists = await tableExists(VersionsAR.table);
		if (!versionsTableExists) {
			await createTable(VersionsAR);
		}

		const mutationsTableExists = await tableExists(MutationsAR.table);
		if (!mutationsTableExists) {
			await createTable(MutationsAR);
		}


		return checkTheRestOfTheTables();
	};

	const setupConnection = async () => {
		const adminConnectionData = {
			host     : 'localhost',
			user     : 'storyboard_admin',
			password : 'storyboard_admin',
			database : 'storyboard',
		};
		adminConnection = await mysqlPromise.createConnection(adminConnectionData);
		defaultConnection = mysql.createConnection(adminConnectionData); // this needs to change
		defaultPromiseConnection = await mysqlPromise.createConnection(adminConnectionData);
		
		return ensureTablesSetup();
	};

	const ensureUsersSetup = async (connection: mysqlPromise.Connection) => {
		const userQuery = 'SELECT EXISTS(SELECT 1 FROM mysql.user WHERE user = "storyboard_admin");';
		
		try {
			const results = await connection.query(userQuery);
			
			let foundAdmin = false;
			if (results.length > 0) {
				Object.entries(results[0]).forEach(([, result,]) => {
					foundAdmin = 0 !== result;
				});
			}
			
			if (!foundAdmin)
			{
				throw new Error('admin user not found');
			}

			return setupConnection();

		} catch (error) {
			throw error;
		}
	};

	/**
	 * no functionality yet, purpose to detect existance of database, schemas and users and create them if missing
	 * @param next function to call once complete
	 */
	const ensureDbIsSetup = async () => {
		const connection = await mysqlPromise.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'password',
			// database : 'my_db'
		});

		const databaseQuery = `SELECT SCHEMA_NAME
			FROM INFORMATION_SCHEMA.SCHEMATA
	   		WHERE SCHEMA_NAME = ?;
		`;

		try {
			const results = await connection.query(databaseQuery, [databaseName,]) as OkPacket[];
			if (!results || results.length === 0)
			{
				// create database
				throw new Error('database doesnt exist');
			}
			
			return ensureUsersSetup(connection);
		} catch (error) {
			throw error;
		}
	};

	export const InitDb = async () => {
		return ensureDbIsSetup();
	};

	export const promisedExecute = async (statement: string, params: any[] = []) => {
		if (!defaultPromiseConnection) {
			throw new Error('default database connection couldn\'t be established');
		}
		return await defaultPromiseConnection.query(statement, params);
	};
}