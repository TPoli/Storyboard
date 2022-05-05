import 'dotenv/config'

type Config = {
	dbHost: string;
	sessionUsername: string;
	sessionPassword: string;
	dbName: string;
};

let configInstance: Config | null = null;

const getConfig = () => {
	if (configInstance === null) {
		configInstance = {
			dbHost: process.env.STORYBOARD_DB_HOST,
			sessionUsername: process.env.STORYBOARD_SESSION_USERNAME,
			sessionPassword: process.env.STORYBOARD_SESSION_PASSWORD,
			dbName: process.env.STORYBOARD_DB_NAME,
			
		};
	}

	return configInstance;
};

export { getConfig }
