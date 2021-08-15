const mysql = require('mysql2');

import { findSourceMap } from 'module';
import { Model, Collumn } from './models/model';
import Versions from './models/versions';
import Mutations from './models/mutations';


export namespace Db {

	const databaseName = 'storyboard';

	export type DbCallback = (error: any, results: any[], fields: any) => void;
	export const schemas = [
		Versions,
		Mutations
	] as typeof Model[];

	let defaultConnection: any = null;

	const collumnToDbType = (collumn: Collumn): string => {
		switch (collumn.type) {
			case 'int':
				return 'INT';
			case 'string':
				return 'VARCHAR(45)';
			case 'json':
				return 'JSON';
			case 'bool':
				return 'BOOLEAN';
			default:
				throw new Error(`unhandled column type: ${collumn.type}`);
		};
	};

	const createTable = (connection: any, tableName: string, model: Model, callback: () => void) => {
		let createQuery = `CREATE TABLE \`${databaseName}\`.\`${tableName}\` (`;
		let primaryKey = '';
		model.collumns.forEach((collumn: Collumn) => {
			createQuery += collumn.name + ' ' + collumnToDbType(collumn);
			if (collumn.primary == true) {
				primaryKey = collumn.name;
			}
			if (!collumn.nullable) {
				createQuery += ` NOT`;
			}
			createQuery += ' NULL';

			if (collumn.autoIncrement) {
				createQuery += ' AUTO_INCREMENT';
			}

			createQuery += ', ';
		});

		createQuery = createQuery + `PRIMARY KEY (${primaryKey}), `;
		createQuery = createQuery + `UNIQUE INDEX ${primaryKey + '_UNIQUE'} (${primaryKey} ASC) VISIBLE);`;

		const createCallback = (error: any, results: any[], fields: any) => {
			if (error) {
				throw error
			};
			callback();
		};

		connection.query(createQuery, createCallback);
	};

	const tableExists = (connection: any, tableName: string, callback: (exists: boolean) => void): void => {
		const existsQuery = `
			SELECT * FROM information_schema.tables
			WHERE table_schema = ?
				AND table_name = ?
			LIMIT 1;
		`;

		const existsCallback = (error: any, results: any[], fields: any) => {
			if (error) {
				throw error
			};
			callback(results.length > 0);
		};

		connection.query(existsQuery, [databaseName, tableName], existsCallback);
	};

	const ensureTablesSetup = (connection: any, next: () => void) => {
		// const t = Versions.find<Versions>();

		const checkTheRestOfTheTables = () => {
			schemas.forEach((schema: typeof Model) => {
				// schema.name
				// check table exists, is same version and if version changed if there are any migrations to update to the correct version
			});

			// database is finally ready, launch the server using next();
			next(); // needs to be called after all of the callbacks in forEach resolve
		};

		const mutationsReadyCallback = (exists: boolean) => {
			if (!exists) {
				createTable(connection, Mutations.table, new Mutations(), () => {
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
				createTable(connection, Versions.table, new Versions(), () => {
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

	const setupConnection = (connection: any, next: () => void) => {
		defaultConnection = mysql.createConnection({
			host     : 'localhost',
			user     : 'storyboard_admin',
			password : 'storyboard_admin',
			database : 'storyboard'
		});
		ensureTablesSetup(connection, next);
	};

	const ensureUsersSetup = (connection: any, next: () => void) => {
		const userQuery = 'SELECT EXISTS(SELECT 1 FROM mysql.user WHERE user = "storyboard_admin");';
		const userQueryCallback: DbCallback = (error: any, results: any[], fields: any) => {
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
		const databaseQueryCallback = (error: any, results: any[], fields: any) => {
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
		// const parser: DbCallback = (error: any, results: any[], fields: any) => {
		// 	const modifiedResults: any[] = [];

		// 	results.forEach((result) => {
		// 		console.log(result.id);
		// 	});
			
		// 	callback(error, modifiedResults, fields);
		// };
		defaultConnection.query(statement, callback);
	};
};