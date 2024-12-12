import {SignInRequest, TenantCode, TenantId} from '@rainbow-n12/shared-model';
import {ServerConfig} from '../../server-envs';
import {ErrTenantNotSupported, PreparedDataAndValidation, PrepareForValidation} from '../common';
import {TypeOrmQueryCriteria} from '../types';
import {RestApiPublisher, Steps} from '../utils';
import {ErrPasswordMustProvided, ErrUserNameMustProvided, SignIn as SignInApi} from './constants';

type DataAndValidation = PreparedDataAndValidation<SignInRequest>;

interface FindTenantByCodeCriteria {
	tenantId?: TenantId;
	tenantCode?: TenantCode;
}

type FindTenantQueryBasis = TypeOrmQueryCriteria<FindTenantByCodeCriteria>;

interface FindUserCriteria {
	tenantId?: TenantId;
	tenantCode?: TenantCode;
	username?: string;
}

type FindUserQueryBasis = TypeOrmQueryCriteria<FindUserCriteria>;

export const SignIn = () => {
	// make sure username and password existing
	const CheckRequestData = Steps.snippet<DataAndValidation, DataAndValidation>('CheckRequestData')
		.execute(async ($factor, _, $) => {
			const {data, validationResult: validation} = $factor;
			$.touch(data.username).isBlank().success(() => validation.error(ErrUserNameMustProvided).message('User name must be provided.').at('username'));
			$.touch(data.password).isBlank().success(() => validation.error(ErrPasswordMustProvided).message('Password must be provided.').at('password'));
			return $factor;
		});
	// load/check tenant data when multiple tenant enabled, and at least one of tenant id/code is provided
	const EnsureTenantIdIfShould = Steps.conditional<DataAndValidation, DataAndValidation>('EnsureTenantIdIfShould')
		.testBy(async ($factor, _, $) => {
			const {data} = $factor;
			return ServerConfig.MULTIPLE_TENANT_ENABLED
				&& ($.touch(data.tenantId).isNotBlank().ok() || $.touch(data.tenantCode).isNotBlank().ok());
		})
		.then(
			Steps.loadOneBySQL<DataAndValidation, DataAndValidation>('FindTenantIdByCode')
				.inputConvertBy<FindTenantQueryBasis>(async ($factor, _, $) => {
					const {data} = $factor;
					const filters = [];
					const params: FindTenantByCodeCriteria = {};
					$.touch(data.tenantId).isNotBlank().success(() => {
						filters.push('TENANT_ID = $tenantId');
						params.tenantId = data.tenantId;
					});
					$.touch(data.tenantCode).isNotBlank().success(() => {
						filters.push('CODE = $tenantCode');
						params.tenantCode = data.tenantCode;
					});
					return {
						params, sql: `SELECT TENANT_ID AS "tenantId", CODE AS "tenantCode"
                                      FROM T_TENANT
                                      WHERE ${filters.join(' AND ')}`
					};
				})
				// TODO set datasource
				.datasource('')
				.autonomousTransaction()
				.ignoreStaticSql()
				.outputConvertBy<FindTenantByCodeCriteria>(async ($result, $request) => {
					const $factor = $request.content;
					$factor.data.tenantId = $result?.tenantId;
					$factor.data.tenantCode = $result?.tenantCode;
					return $factor;
				})
		)
		.otherwise(
			Steps.snippet<DataAndValidation, DataAndValidation>('CheckTenantRelatedFromRequestData')
				.execute(async ($factor, _, $) => {
					// tenant criteria is not allowed when multiple tenant is disabled
					if (!ServerConfig.MULTIPLE_TENANT_ENABLED) {
						const {data, validationResult: validation} = $factor;
						$.touch(data.tenantId).isNotBlank().success(() => validation.error(ErrTenantNotSupported).message('Tenant not supported.').at('tenantId'));
						$.touch(data.tenantCode).isNotBlank().success(() => validation.error(ErrTenantNotSupported).message('Tenant not supported.').at('tenantId'));
					}
					return $factor;
				})
		);
	// const FindUser = Steps.loadManyBySQL('FindUser', {
	// 	fromInput: buildFromInput<DataAndValidation, FindUserQueryBasis>(async ($factor, request, $) => {
	//
	// 	}),
	// 	sql: '@ignore'
	// });

	return RestApiPublisher
		.use(SignInApi)
		.permitAll()
		.enable(ServerConfig.USER_PWD_SIGNIN_ENABLED)
		.steps(
			PrepareForValidation,
			// checking request
			CheckRequestData,
			EnsureTenantIdIfShould
			// check finished
			// ResponseOnValidationNotOkOrElse(
			//
			// )
		)
		.publish();
};
