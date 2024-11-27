import {ImportConfigType, Tenanted} from '@rainbow-n12/shared-model';
import {TypeOrmBasis} from '@rainbow-o23/n3';
import {APIPublisher, asT, buildFromInput, buildSnippet, Steps} from '../utils';
import {ImportDataRoutes} from './routes';

interface AskImportConfigRequest {
	type?: ImportConfigType;
	pageSize?: number;
	pageNumber?: number;
}

interface LoadCriteria extends TypeOrmBasis {
	sql: string;
	params: {
		type?: ImportConfigType;
		offset: number;
		size: number;
	};
}

export const AskImportConfigList = () => {
	const ValidateCriteria = Steps.snippet('Validate criteria', {
		snippet: buildSnippet<AskImportConfigRequest, AskImportConfigRequest>(async ($factor, _, $) => {
			const {type, pageSize, pageNumber} = $factor ?? {};
			return {
				type,
				pageSize: $.touch(pageSize).isInRange({
					min: 0, max: 100, interval: 'lo'
				}).toFixed0.toNumber.orUseDefault(20).value<number>(),
				pageNumber: $.touch(pageNumber).isPositive.toFixed0.toNumber.orUseDefault(1).value<number>()
			};
		})
	});
	const LoadConfigList = Steps.useLoadBySQL('Load import config list', {
		fromInput: buildFromInput<AskImportConfigRequest, LoadCriteria>(async ($factor, request, $) => {
			const {type, pageSize, pageNumber} = $factor;
			const tenantId = asT<Tenanted>(request.$context?.authorization)?.tenantId;
			const tenantFilter = $.touch(tenantId)
				.isNotBlank().replaceWith(() => 'TENANT_ID = $tenantId')
				.orUseDefault('').value<string>();
			const typeFilter = $.touch(type)
				.isNotBlank().replaceWith(() => 'TYPE = $type')
				.orUseDefault('').value<string>();
			const where = $.touch([tenantFilter, typeFilter])
				.replaceWith((filters: string[]) => filters.filter(Boolean).join(' AND '))
				.isNotBlank().replaceWith((filters: string) => `WHERE ${filters}`)
				.value<string>();

			return {
				sql: `SELECT CONFIG_ID AS "configId", CODE AS "code", NAME AS "name", TYPE AS "type"
                      FROM T_IMPORT_CONFIG ${where}
                      ORDER BY CODE $.limit($offset, $size)`,
				params: {tenantId, type, offset: (pageNumber - 1) * pageSize, size: pageSize}
			};
		}),
		// use sql from input
		sql: '@ignore'
	});

	return APIPublisher
		.use(ImportDataRoutes.AskImportConfigList)
		.authenticated()
		.enable()
		.steps(ValidateCriteria, LoadConfigList)
		.publish();
};
