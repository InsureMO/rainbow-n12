import {ExposedPipelineDef} from '@rainbow-o23/n4';
import {RestApiMeta, ServiceApiMeta} from '../types';

export const asRestApi = (code: string, route: string, method: ExposedPipelineDef['method']): Readonly<RestApiMeta> => {
	const def: RestApiMeta = {name: code, code, route, method, type: 'pipeline'};
	if (method !== 'get') {
		def.body = true;
	}
	return def;
};
export const asServiceApi = (code: string): Readonly<ServiceApiMeta> => {
	return {name: code, code, type: 'pipeline'};
};
