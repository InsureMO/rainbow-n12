import {ExtendedBootstrapOptions} from '@rainbow-o23/n90';
import {Authenticate} from './authenticate';
import {JwtAuthenticate} from './jwt-authenticate';

export const useAuthenticateModuleInitialize = async (options: ExtendedBootstrapOptions) => {
	options.addProgrammaticPipelineDef({
		Authenticate,
		JwtAuthenticate
	});
};
