import {ExtendedBootstrapOptions} from '@rainbow-o23/n90';
import {useAuthenticateModuleInitialize} from './authenticate';
import {useImportDataModuleInitialize} from './import-data';
import {useOrganizationModuleInitialize} from './organization';

export const useProgrammaticModuleInitialize = async (options: ExtendedBootstrapOptions) => {
	await useAuthenticateModuleInitialize(options);
	await useOrganizationModuleInitialize(options);
	await useImportDataModuleInitialize(options);
};
