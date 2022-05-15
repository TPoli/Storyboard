import * as mysqlPromise from 'mysql2/promise';
import { OkPacket } from 'mysql2/promise';
import { getConfig } from '../main';
import { adminConnectionData } from './config';

const config = getConfig();

type Connections = {
	adminConnection: mysqlPromise.Connection,
    userConnection: mysqlPromise.Connection,
};

export const ensureDbIsSetup = async (): Promise<Connections> => {
	const connection = await mysqlPromise.createConnection({
		host: config.dbHost,
		user: config.dbRootUsername,
		password: config.dbRootPassword,
	});

	const databaseQuery = `SELECT SCHEMA_NAME
		FROM INFORMATION_SCHEMA.SCHEMATA
		   WHERE SCHEMA_NAME = ?;
	`;

	try {
		const results = await connection.query(databaseQuery, [config.dbName]) as OkPacket[];
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

const ensureUsersSetup = async (connection: mysqlPromise.Connection): Promise<Connections> => {
	const userQuery = 'SELECT EXISTS(SELECT 1 FROM mysql.user WHERE user = ?);';
	
	try {
		const results = await connection.query(userQuery, [ config.dbAdminUsername ]);
		
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

const setupConnection = async (): Promise<Connections> => {
	const adminConnection = await mysqlPromise.createConnection(adminConnectionData);
	const userConnection = await mysqlPromise.createConnection(adminConnectionData);
	
	return {
		adminConnection,
		userConnection,
	};
};