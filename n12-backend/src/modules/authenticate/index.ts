import {ExtendedBootstrapOptions} from '@rainbow-o23/n90';
import {Authenticate} from './authenticate';
import {SignIn} from './sign-in';

export const useAuthenticateModuleInitialize = async (options: ExtendedBootstrapOptions) => {
	options.addProgrammaticPipelineDef({
		Authenticate,
		SignIn
	});
};
