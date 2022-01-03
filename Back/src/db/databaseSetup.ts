import * as mysqlPromise from 'mysql2/promise';
import { OkPacket } from 'mysql2/promise';
import { dbName, host, systemAdminPassword, systemAdminUser } from './config';

type Connections = {
	adminConnection: mysqlPromise.Connection,
    userConnection: mysqlPromise.Connection,
};

export const ensureDbIsSetup = async (): Promise<Connections> => {
	const connection = await mysqlPromise.createConnection({
		host,
		user: systemAdminUser,
		password : systemAdminPassword,
	});

	const databaseQuery = `SELECT SCHEMA_NAME
		FROM INFORMATION_SCHEMA.SCHEMATA
		   WHERE SCHEMA_NAME = ?;
	`;

	try {
		const results = await connection.query(databaseQuery, [dbName,]) as OkPacket[];
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

const setupConnection = async (): Promise<Connections> => {
	const adminConnectionData = {
		host,
		user     : 'storyboard_admin',
		password : 'storyboard_admin',
		database : 'storyboard',
	};
	const adminConnection = await mysqlPromise.createConnection(adminConnectionData);
	const userConnection = await mysqlPromise.createConnection(adminConnectionData);
	
	return {
		adminConnection,
		userConnection,
	};
};