import {ExtendedBootstrapOptions} from '@rainbow-o23/n90';
import {useImportDataModuleInitialize} from './import-data';

export const useProgrammaticModuleInitialize = async (options: ExtendedBootstrapOptions) => {
	await useImportDataModuleInitialize(options);
};
