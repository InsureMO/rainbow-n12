import {apiDefMeta} from '../utils';

export class ImportDataRoutes {
	static readonly AskImportConfigList = apiDefMeta('AskImportConfigList', '/import/config/list', 'post');

	// noinspection JSUnusedLocalSymbols
	private constructor() {
		// avoid extend
	}
}
