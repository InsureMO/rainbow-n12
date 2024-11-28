import {BootstrapOptions} from '@rainbow-o23/n2';
import {ExtendedBootstrapOptions, launchServer} from '@rainbow-o23/n90';
import {useProgrammaticModuleInitialize} from './modules';
import {usePluginsInitialize} from './plugins';
import {useAskConfigurationAnywhere} from './server-envs';
import {SimpleModule} from './simple';

const useSimpleModule = async (options: BootstrapOptions) => {
	if (options.getEnvAsBoolean('app.examples.enabled', false)) {
		SimpleModule.registerMyself(options);
	}
};

// noinspection JSIgnoredPromiseFromCall
launchServer({
	beforeDoPipelineInitialization: async (options: ExtendedBootstrapOptions) => {
		await useAskConfigurationAnywhere(options);
		await usePluginsInitialize(options);
		await useProgrammaticModuleInitialize(options);
	},
	beforeDoServerLaunch: async (options: BootstrapOptions) => {
		await useSimpleModule(options);
	}
});
