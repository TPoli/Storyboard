import { MinutesToMilliseconds } from '../../../Core/Utils/Utils';
import { getConfig } from './config';
const expressMysqlSession = require('express-mysql-session');

const config = getConfig();

const options = {
	clearExpired: true,
	checkExpirationInterval: MinutesToMilliseconds(120),
	expiration: MinutesToMilliseconds(60),
	createDatabaseTable: true, // CREATE IF NOT EXISTS
    host: config.dbHost,
	user: config.sessionUsername,
	password: config.sessionUsername,
	database: config.dbName,
};

const getSessionStore = (session: any) => {
	const MySQLStore = expressMysqlSession(session);

	return new MySQLStore(options);
}

export {
	getSessionStore,
}
