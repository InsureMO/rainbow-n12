import {ExtendedBootstrapOptions} from '@rainbow-o23/n90';
import {Authenticate} from './authenticate';

export const useAuthenticateModuleInitialize = async (options: ExtendedBootstrapOptions) => {
	options.addProgrammaticPipelineDef({
		Authenticate
	});
};
