import {ExtendedBootstrapOptions} from '@rainbow-o23/n90';
import {AskImportConfigList} from './ask-import-config-list';

export const useImportDataModuleInitialize = async (options: ExtendedBootstrapOptions) => {
	options.addProgrammaticPipelineDef({
		AskImportConfigList
	});
};
