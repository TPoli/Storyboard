import {Config as baseConfig, StoryboardConfig} from '../../Core/Config/config';

type ServerConfig = StoryboardConfig & {

};

const createConfig = (): ServerConfig => {
	return {
		...baseConfig
	}
};

const Config = createConfig();

export {
	ServerConfig,
	Config
};