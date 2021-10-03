import * as mysql from 'mysql2';

import { Column } from './models/model';
import Versions from './models/versions';
import Mutations from './models/mutations';
import Account from './models/account';
import Transactions from './models/transactions';
import { CamelCase } from '../../Core/Utils/Utils';
import ContentAR from './models/ContentAR';
import CollectionAR from './models/CollectionAR';

type Schema = typeof Versions | typeof Mutations | typeof Account | typeof Transactions;

export namespace Db {

	const databaseName = 'storyboard';

	export type DbCallback = (error: mysql.QueryError | null, results: any[], fields:  mysql.FieldPacket[]) => void;
	export const schemas = [
		// Versions,
		// Mutations,
		Account,
		Transactions,
		ContentAR,
		CollectionAR,
	] as Schema[];

	let defaultConnection: mysql.Connection|null = null;
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
			};
			model.createDefaultEntries(callback);
		};

		const tableName = `${databaseName}.${model.table}`;

		let sql = `ALTER TABLE ${tableName}`;
		let first = true;

		foreignKeyColumns.forEach((column: Column) => {
			if (!column.references) {
				return;
			}
			const fkName = CamelCase([model.table, column.references.model, column.references.column, 'Fk' ]);
			sql += `${(first ? '' : ',')}\nADD CONSTRAINT ${fkName}\n`;
			sql += `FOREIGN KEY (${column.name})\n`;
			sql += `REFERENCES ${tableName} (${column.references.column})\n`;
			sql += `ON UPDATE NO ACTION ON DELETE NO ACTION`;
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
		let primaryKeys: string[] = [];
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
				createQuery += ` NOT`;
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
			};
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
			};
			callback(results.length > 0);
		};

		adminConnection.query(existsQuery, [databaseName, tableName], existsCallback);
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
				createTable(Mutations, () => {
					checkTheRestOfTheTables();
				});
			} else {
				checkTheRestOfTheTables();
			}
		};

		const versionsReadyCallback = (exists: boolean) => {
			if (!exists) {
				createTable(Versions, () => {
					tableExists(Mutations.table, mutationsReadyCallback);
				});
			} else {
				tableExists(Mutations.table, mutationsReadyCallback);
			}
		};

		tableExists(Versions.table, versionsReadyCallback);
	};

	const setupConnection = (connection: mysql.Connection, next: () => void) => {
		adminConnection = mysql.createConnection({
			host     : 'localhost',
			user     : 'storyboard_admin',
			password : 'storyboard_admin',
			database : 'storyboard'
		});
		ensureTablesSetup(next);
	};

	const ensureUsersSetup = (connection: mysql.Connection, next: () => void) => {
		const userQuery = 'SELECT EXISTS(SELECT 1 FROM mysql.user WHERE user = "storyboard_admin");';
		const userQueryCallback: DbCallback = (error, results, fields) => {
			if (error) {
				throw error
			};
			let foundAdmin = false;
			if (results.length > 0) {
				Object.entries(results[0]).forEach(([, result]) => {
					foundAdmin = 0 !== result;
				});
			}
			if (!foundAdmin)
			{
				throw new Error('admin user not found');
				// create user storyboard_admin
				// will also need to setup non-admin user for least privlaged access
			}
			setupConnection(connection, next);
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
		const databaseQueryCallback: DbCallback = (error, results, fields) => {
			if (error) {
				throw error
			};
			if (results.length === 0)
			{
				// create database
				throw new Error('database doesnt exist');
			}

			ensureUsersSetup(connection, next);
		};

		connection.query(databaseQuery, [databaseName], databaseQueryCallback);
	};

	// this function needs to be made synchronous
	export const InitDb = (next: () => void) => {
		ensureDbIsSetup(next);
	};

	export const execute = (statement: string, params: any[], callback: DbCallback ) => {
		// const parser: DbCallback = (error, results, fields) => {
		// 	const modifiedResults: any[] = [];

		// 	results.forEach((result) => {
		// 		console.log(result.id);
		// 	});
			
		// 	callback(error, modifiedResults, fields);
		// };
		defaultConnection?.query(statement, params, callback);
	};
};