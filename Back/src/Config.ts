import {Config as baseConfig, StoryboardConfig} from 'core';

type ServerConfig = StoryboardConfig & {

};

const createConfig = (): ServerConfig => {
	return {
		...baseConfig,
	}
};

const Config = createConfig();

export {
	ServerConfig,
	Config
};