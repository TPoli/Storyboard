const mysql = require('mysql2');

import { findSourceMap } from 'module';
import { Model } from './models/model';
import Versions from './models/versions';


export namespace Db {

	export type DbCallback = (error: any, results: any[], fields: any) => void;
	export const schemas = [
		Versions
	] as typeof Model[];

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
	   		WHERE SCHEMA_NAME = 'storyboard';
		`;
		const databaseQueryCallback = (error: any, results: any[], fields: any) => {
			if (error) {
				throw error
			};
			if (results.length === 0)
			{
				// create table
			}

			setupConnection(next);
		};

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
				// create user storyboard_admin
			}
			connection.query(databaseQuery, databaseQueryCallback);
		};
		const t = Versions.find<Versions>();
		schemas.forEach((schema: typeof Model) => {
			// schema.name
			// check table exists, is same version and if version changed if there are any migrations to update to the correct version
		});

		connection.query(userQuery, userQueryCallback);
	};

	let defaultConnection: any = null;

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

	const setupConnection = (next: () => void) => {
		defaultConnection = mysql.createConnection({
			host     : 'localhost',
			user     : 'storyboard_admin',
			password : 'storyboard_admin',
			database : 'storyboard'
		});
		next();
	};
	// this function needs to be made syncronous
	export const InitDb = (next: () => void) => {
		ensureDbIsSetup(next);
	};
};