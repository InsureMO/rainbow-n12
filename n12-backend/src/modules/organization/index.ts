import {ExtendedBootstrapOptions} from '@rainbow-o23/n90';
import {CreateTenant} from './tenant';

export const useOrganizationModuleInitialize = async (options: ExtendedBootstrapOptions) => {
	options.addProgrammaticPipelineDef({
		CreateTenant
	});
};
