import {
	ImportConfig,
	ImportConfigType,
	PageableRequest,
	PageableResponse,
	Tenanted,
	TenantId
} from '@rainbow-n12/shared-model';
import {TypeOrmPageable, TypeOrmQueryCriteria, TypeOrmWithSQL} from '../types';
import {APIPublisher, asT, buildFromInput, pageToTypeOrm, Steps} from '../utils';
import {ImportDataRoutes} from './routes';

interface AskImportConfigRequest extends PageableRequest {
	type?: ImportConfigType;
}

type ImportConfigItem = Pick<ImportConfig, 'configId' | 'code' | 'name' | 'type' | 'enabled'>;

interface AskImportConfigResponse extends PageableResponse<ImportConfigItem> {
}

interface Criteria extends TypeOrmPageable {
	tenantId?: TenantId;
	type?: ImportConfigType;
}

type QueryBasis = TypeOrmWithSQL<TypeOrmQueryCriteria<Criteria>>;

export const AskImportConfigList = () => {
	const LoadConfigList = Steps.useLoadBySQL('Load import config list', {
		fromInput: buildFromInput<AskImportConfigRequest, QueryBasis>(async ($factor, request, $) => {
			const {type, pageSize, pageNumber} = $factor ?? {};
			const tenantId = asT<Tenanted>(request.$context?.authorization)?.tenantId;
			const tenantFilter = $.touch(tenantId)
				.isNotBlank().replaceWith(() => 'TENANT_ID = $tenantId')
				.orUseDefault('').value<string>();
			const typeFilter = $.touch(type)
				.isNotBlank().replaceWith(() => 'TYPE = $type')
				.orUseDefault('').value<string>();
			const where = $.touch([tenantFilter, typeFilter])
				.replaceWith((filters: string[]) => filters.filter(Boolean).join(' AND '))
				.isNotBlank().prefix('WHERE ')
				.value<string>();

			return {
				sql: `SELECT CONFIG_ID AS "configId",
                             CODE      AS "code",
                             NAME      AS "name",
                             TYPE      AS "type",
                             ENABLED   AS "enabled"
                      FROM T_IMPORT_CONFIG ${where}
                      ORDER BY NAME $.limit($offset, $size)`,
				params: {tenantId, type, ...pageToTypeOrm({pageSize, pageNumber})}
			} as QueryBasis;
		}),
		// use sql from input
		sql: '@ignore'
	});

	return APIPublisher
		.use(ImportDataRoutes.AskImportConfigList)
		.authenticated()
		.enable()
		.steps(LoadConfigList)
		.publish();
};
