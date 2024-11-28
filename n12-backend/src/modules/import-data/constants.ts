import {asRestApi} from '../utils';

export class ImportDataConstants {
	static readonly AskImportConfigList = asRestApi('AskImportConfigList', '/import/config/list', 'post');

	// noinspection JSUnusedLocalSymbols
	private constructor() {
		// avoid extend
	}
}
