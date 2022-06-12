import 'dotenv/config'

type Config = {
	dbHost: string;
	sessionUsername: string;
	sessionPassword: string;
	dbName: string;
	dbRootUsername: string;
	dbRootPassword: string;
	dbAdminUsername: string;
	dbAdminPassword: string;
};

let configInstance: Config | null = null;

const getConfig = (): Config => {
	if (configInstance === null) {
		configInstance = {
			dbHost: process.env.STORYBOARD_DB_HOST,
			sessionUsername: process.env.STORYBOARD_SESSION_USERNAME,
			sessionPassword: process.env.STORYBOARD_SESSION_PASSWORD,
			dbName: process.env.STORYBOARD_DB_NAME,
			dbRootUsername: process.env.STORYBOARD_DB_ROOT_USERNAME,
			dbRootPassword: process.env.STORYBOARD_DB_ROOT_PASSWORD,
			dbAdminUsername: process.env.STORYBOARD_DB_ADMIN_USERNAME,
			dbAdminPassword: process.env.STORYBOARD_DB_ADMIN_PASSWORD,
		};
	}

	return configInstance;
};

export { getConfig }
