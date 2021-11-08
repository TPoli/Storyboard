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
	let adminConnection: mysql.Connection|null = null;

	const setForeignKeys = (schema: Schema, callback: () => void) => {
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
			callback();
			return;
		}

		const createCallback: DbCallback = (error, results, fields) => {
			if (error) {
				throw error
			}
			model.createDefaultEntries(callback);
		};

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

		adminConnection.query(sql, createCallback);
	};

	const createTable = (schema: Schema, callback: () => void) => {
		if (!adminConnection) {
			throw new Error('admin database connection not established');
		}

		const model = new schema();
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

		const createCallback: DbCallback = (error, results, fields) => {
			if (error) {
				throw error
			}
			model.createDefaultEntries(callback);
		};

		adminConnection.query(createQuery, createCallback);
	};

	const tableExists = (tableName: string, callback: (exists: boolean) => void): void => {
		if (!adminConnection) {
			throw new Error('admin database connection not established');
		}
		const existsQuery = `
			SELECT * FROM information_schema.tables
			WHERE table_schema = ?
				AND table_name = ?
			LIMIT 1;
		`;

		const existsCallback: DbCallback = (error, results, fields) => {
			if (error) {
				throw error
			}
			callback(results.length > 0);
		};

		adminConnection.query(existsQuery, [databaseName, tableName,], existsCallback);
	};

	const ensureForeignKeysSet = (next: () => void, newSchemas: Schema[]) => {
		let completed = 0;
			
		const completedCallback = () => {
			++completed;
			if(completed === schemas.length) {
				// database is finally ready, launch the server using next();
				next(); // needs to be called after all of the callbacks in forEach resolve
			}
		};

		newSchemas.forEach((schema: Schema) => {
			setForeignKeys(schema, completedCallback);
		});
	};

	const ensureTablesSetup = (next: () => void) => {
		const checkTheRestOfTheTables = () => {
			let completed = 0;
			const newSchemas: Schema[] = [];
			const completedCallback = () => {
				++completed;
				if(completed === schemas.length) {
					if (newSchemas.length === 0) {
						// database is finally ready, launch the server using next();
						next(); // needs to be called after all of the callbacks in forEach resolve
					} else {
						ensureForeignKeysSet(next, newSchemas);
					}
				}
			};

			schemas.forEach((schema: Schema) => {
				const model = new schema();
				tableExists(model.table, (exists: boolean) => {
					if (exists) {
						completedCallback();
					} else {
						// this should be awaited
						newSchemas.push(schema);
						createTable(schema, completedCallback);
					}
					// both of the above should check version + run migrations instead of just running completeCallback
				});
			});
		};

		const mutationsReadyCallback = (exists: boolean) => {
			if (!exists) {
				createTable(MutationsAR, () => {
					checkTheRestOfTheTables();
				});
			} else {
				checkTheRestOfTheTables();
			}
		};

		const versionsReadyCallback = (exists: boolean) => {
			if (!exists) {
				createTable(VersionsAR, () => {
					tableExists(MutationsAR.table, mutationsReadyCallback);
				});
			} else {
				tableExists(MutationsAR.table, mutationsReadyCallback);
			}
		};

		tableExists(VersionsAR.table, versionsReadyCallback);
	};

	const setupConnection = async (next: () => void) => {
		const adminConnectionData = {
			host     : 'localhost',
			user     : 'storyboard_admin',
			password : 'storyboard_admin',
			database : 'storyboard',
		};
		adminConnection = mysql.createConnection(adminConnectionData);
		defaultConnection = mysql.createConnection(adminConnectionData); // this needs to change
		defaultPromiseConnection = await mysqlPromise.createConnection(adminConnectionData);
		ensureTablesSetup(next);
	};

	const ensureUsersSetup = async (connection: mysql.Connection, next: () => void) => {
		const userQuery = 'SELECT EXISTS(SELECT 1 FROM mysql.user WHERE user = "storyboard_admin");';
		const userQueryCallback: DbCallback = (error, results, fields) => {
			if (error) {
				throw error
			}
			let foundAdmin = false;
			if (results.length > 0) {
				Object.entries(results[0]).forEach(([, result,]) => {
					foundAdmin = 0 !== result;
				});
			}
			if (!foundAdmin)
			{
				throw new Error('admin user not found');
				// create user storyboard_admin
				// will also need to setup non-admin user for least privlaged access
			}
			setupConnection(next);
		};

		connection.query(userQuery, userQueryCallback);
	};

	/**
	 * no functionality yet, purpose to detect existance of database, schemas and users and create them if missing
	 * @param next function to call once complete
	 */
	const ensureDbIsSetup = (next: () => void) => {
		const connection = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'password',
			// database : 'my_db'
		});

		const databaseQuery = `SELECT SCHEMA_NAME
			FROM INFORMATION_SCHEMA.SCHEMATA
	   		WHERE SCHEMA_NAME = ?;
		`;
		const databaseQueryCallback: DbCallback = async (error, results, fields) => {
			if (error) {
				throw error
			}
			if (results.length === 0)
			{
				// create database
				throw new Error('database doesnt exist');
			}

			ensureUsersSetup(connection, next);
		};

		connection.query(databaseQuery, [databaseName,], databaseQueryCallback);
	};

	// this function needs to be made synchronous
	export const InitDb = (next: () => void) => {
		ensureDbIsSetup(next);
	};

	export const execute = (statement: string, params: any[], callback: DbCallback ) => {
		if (!defaultConnection) {
			throw new Error('default database connection couldn\'t be established');
		}
		defaultConnection.query(statement, params, callback);
	};

	// TODO convert to using this as default
	export const promisedExecute = async (statement: string, params: any[]) => {
		if (!defaultPromiseConnection) {
			throw new Error('default database connection couldn\'t be established');
		}
		return await defaultPromiseConnection.execute(statement, params);
	};
}