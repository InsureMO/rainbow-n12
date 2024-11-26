import {ImportType, Tenanted} from '@rainbow-n12/shared-model';
import {APIPublisher, asT, buildFromInput, buildSnippet, Steps} from '../utils';
import {ImportDataRoutes} from './routes';
import {TypeOrmBasis} from '@rainbow-o23/n3';

interface AskImportConfigRequest {
	type?: ImportType;
	pageSize?: number;
	pageNumber?: number;
}

interface LoadCriteria extends TypeOrmBasis {
	sql: string;
	params: {
		type?: ImportType;
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
			const tenantFilter = $.touch(tenantId).isBlank().ok() ? '' : 'TENANT_ID = $tenantId';
			const typeFilter = $.touch(type).isBlank().ok() ? '' : 'TYPE = $type';
			const where = $.touch([tenantFilter, typeFilter].filter(Boolean).join(' AND '))
				.isNotBlank()
				.success((filters: string) => `WHERE ${filters}`)
				.failure(() => '');

			return {
				sql: `SELECT CONFIG_ID AS "configId", CODE AS "code", NAME AS "name"
                      FROM T_IMPORT_CONFIG ${where}
                      ORDER BY CODE $.limit($offset, $size)`,
				params: {tenantId, type, offset: (pageNumber - 1) * pageSize, size: pageSize}
			};
		})
	});

	return APIPublisher
		.use(ImportDataRoutes.AskImportConfigList)
		.authenticated()
		.enable()
		.steps(ValidateCriteria, LoadConfigList)
		.publish();
};
