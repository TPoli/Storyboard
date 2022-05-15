import { getConfig } from '../main';

const config = getConfig();

const baseConfig = {
	host: config.dbHost,
	database: config.dbName,
};

const adminConnectionData = {
	...baseConfig,
	user: config.dbAdminUsername,
	password: config.dbAdminPassword,
};

export {
	adminConnectionData,
};
