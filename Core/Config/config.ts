
type StoryboardConfig = {
	serverUrl: 'localhost',
	serverPort: 3000,
	connectionProtocal: 'http' | 'https',
	siteUrl: 'localhost',
	sitePort: 8080
};

const makeConfig = (): StoryboardConfig => {
	return {
		serverUrl: 'localhost',
		serverPort: 3000,
		connectionProtocal: 'http',
		siteUrl: 'localhost',
		sitePort: 8080
	};
};

const Config = makeConfig();

export {
	StoryboardConfig,
	Config
};