import {ExtendedBootstrapOptions} from '@rainbow-o23/n90';
import {useAuthenticateModuleInitialize} from './authenticate';
import {useImportDataModuleInitialize} from './import-data';

export const useProgrammaticModuleInitialize = async (options: ExtendedBootstrapOptions) => {
	await useAuthenticateModuleInitialize(options);
	await useImportDataModuleInitialize(options);
};
