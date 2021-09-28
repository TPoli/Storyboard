import * as mysql from 'mysql2';

import { Collumn } from './models/model';
import Versions from './models/versions';
import Mutations from './models/mutations';
import Account from './models/account';
import Transactions from './models/transactions';

type Schema = typeof Versions | typeof Mutations | typeof Account | typeof Transactions;

export namespace Db {

	const databaseName = 'storyboard';

	export type DbCallback = (error: mysql.QueryError | null, results: any[], fields:  mysql.FieldPacket[]) => void;
	export const schemas = [
		// Versions,
		// Mutations,
		Account,
		Transactions
	] as Schema[];

	let defaultConnection: mysql.Connection|null = null;

	const createTable = (connection: mysql.Connection, schema: Schema, callback: () => void) => {
		const model = new schema();
		let createQuery = `CREATE TABLE \`${databaseName}\`.\`${model.table}\` (`;
		let primaryKeys: string[] = [];
		const uniqueKeys: string[] = [];
		model.collumns.forEach((collumn: Collumn) => {
			createQuery += collumn.name + ' ' + collumn.type;
			if (collumn.primary == true) {
				primaryKeys.push(collumn.name);
			}
			if (collumn.unique) {
				uniqueKeys.push(collumn.name);
			}
			if (!collumn.nullable) {
				createQuery += ` NOT`;
			}
			createQuery += ' NULL';

			if (collumn.autoIncrement) {
				createQuery += ' AUTO_INCREMENT';
			}

			createQuery += ',\n';
		});
		
		createQuery += `PRIMARY KEY (${primaryKeys.join(',')})`;

		// set indexes
		uniqueKeys.forEach((key: string) => {
			createQuery += `,\nUNIQUE INDEX ${key + '_UNIQUE'} (${key} ASC) VISIBLE`;
		});

		model.collumns.forEach((collumn: Collumn) => {
			if (collumn.references) {
				createQuery += `,\nINDEX(${collumn.name})`;
			}
		});

		// set foreign keys
		model.collumns.forEach((collumn: Collumn) => {
			if (!collumn.references) {
				return;
			}

			createQuery += `,\nFOREIGN KEY (${collumn.name})`;
			createQuery += `\n	REFERENCES ${databaseName}.${collumn.references.model}(${collumn.references.collumn})`;
			createQuery += `\n	ON UPDATE NO ACTION ON DELETE NO ACTION`;
		});

		createQuery += ')';

		const createCallback: DbCallback = (error, results, fields) => {
			if (error) {
				throw error
			};
			model.createDefaultEntries(callback);
		};

		connection.query(createQuery, createCallback);
	};

	const tableExists = (connection: mysql.Connection, tableName: string, callback: (exists: boolean) => void): void => {
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

		connection.query(existsQuery, [databaseName, tableName], existsCallback);
	};

	const ensureTablesSetup = (connection: mysql.Connection, next: () => void) => {
		const checkTheRestOfTheTables = () => {
			let completed = 0;
			const completedCallback = () => {
				++completed;
				if(completed === schemas.length) {
					// database is finally ready, launch the server using next();
					next(); // needs to be called after all of the callbacks in forEach resolve
				}
			};

			schemas.forEach((schema: Schema) => {
				const model = new schema();
				tableExists(connection, model.table, (exists: boolean) => {
					if (exists) {
						completedCallback();
					} else {
						// this should be awaited
						createTable(connection, schema, completedCallback);
					}
					// both of the above should check version + run migrations instead of just running completeCallback
				});
			});
		};

		const mutationsReadyCallback = (exists: boolean) => {
			if (!exists) {
				createTable(connection, Mutations, () => {
					checkTheRestOfTheTables();
				});
			}
			else
			{
				checkTheRestOfTheTables();
			}
		};

		const versionsReadyCallback = (exists: boolean) => {
			if (!exists) {
				createTable(connection, Versions, () => {
					tableExists(connection, Mutations.table, mutationsReadyCallback);
				});
			}
			else
			{
				tableExists(connection, Mutations.table, mutationsReadyCallback);
			}
		};

		tableExists(connection, Versions.table, versionsReadyCallback);
	};

	const setupConnection = (connection: mysql.Connection, next: () => void) => {
		defaultConnection = mysql.createConnection({
			host     : 'localhost',
			user     : 'storyboard_admin',
			password : 'storyboard_admin',
			database : 'storyboard'
		});
		ensureTablesSetup(connection, next);
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

	// this function needs to be made syncronous
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