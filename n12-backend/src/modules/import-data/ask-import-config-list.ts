import {
	ImportConfig,
	ImportConfigType,
	PageableRequest,
	PageableResponse,
	Tenanted,
	TenantId
} from '@rainbow-n12/shared-model';
import {TypeOrmPageable, TypeOrmQueryCriteria, TypeOrmWithSQL} from '../types';
import {asT, pageToTypeOrm, RestApiPublisher, Steps} from '../utils';
import {ImportDataConstants} from './constants';

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
	// 1. build base sql
	// 2. start transaction, since two sql should be in same transaction
	// 3. execute count sql to get item count
	// 4. compute page number again
	// 5. execute item sql to get items
	// 6. build response by items and pageable
	const LoadConfigList =
		Steps.loadManyBySQL<AskImportConfigRequest, any>('Load import config list')
			.inputConvertBy<QueryBasis>(async ($factor, request, $) => {
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
                                 ENABLED   AS "enabled.@bool"
                          FROM T_IMPORT_CONFIG ${where}
                          ORDER BY NAME $.limit($offset, $size)`,
					params: {tenantId, type, ...pageToTypeOrm({pageSize, pageNumber})}
				} as QueryBasis;
			})
			// TODO set datasource
			.datasource('')
			.autonomousTransaction()
			.ignoreStaticSql();

	return RestApiPublisher
		.use(ImportDataConstants.AskImportConfigList)
		.authenticated()
		.enable()
		.steps(LoadConfigList)
		.publish();
};
