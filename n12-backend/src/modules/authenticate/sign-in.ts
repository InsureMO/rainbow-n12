import {SignInRequest, TenantCode, Tenanted, TenantId} from '@rainbow-n12/shared-model';
import {ServerConfig} from '../../server-envs';
import {PreparedDataAndValidation, PrepareForValidation, ResponseOnValidationNotOkOrElse} from '../common';
import {TypeOrmQueryCriteria} from '../types';
import {buildConditionalCheck, buildFromInput, buildSnippet, buildToOutput, RestApiPublisher, Steps} from '../utils';
import {ErrPasswordMustProvided, ErrUserNameMustProvided, SignIn as SignInApi} from './constants';

type DataAndValidation = PreparedDataAndValidation<SignInRequest>;

interface FindTenantByCodeCriteria {
	tenantCode: TenantCode;
}

type FindTenantQueryBasis = TypeOrmQueryCriteria<FindTenantByCodeCriteria>;

interface FindUserCriteria {
	tenantId?: TenantId;
	tenantCode?: TenantCode;
	username?: string;
}

type FindUserQueryBasis = TypeOrmQueryCriteria<FindUserCriteria>;

export const SignIn = () => {
	// delete tenant code if tenant id presented
	const CleanRequestData = Steps.snippet('CleanRequestData', {
		snippet: buildSnippet<SignInRequest, SignInRequest>(async ($factor, _, $) => {
			$.touch($factor.tenantId).isNotBlank().success(() => delete $factor.tenantCode);
			return $factor;
		})
	});
	// make sure username and password existing
	const CheckRequestData = Steps.snippet('CheckRequestData', {
		snippet: buildSnippet<DataAndValidation, DataAndValidation>(async ($factor, _, $) => {
			const {data, validationResult: validation} = $factor;
			$.touch(data.username).isBlank().success(() => validation.error(ErrUserNameMustProvided).message('User name must be provided.').at('username'));
			$.touch(data.password).isBlank().success(() => validation.error(ErrPasswordMustProvided).message('Password must be provided.').at('password'));
			return $factor;
		})
	});
	// find tenant id by given code when tenant code presented
	const EnsureTenantIdIfShould = Steps.conditional('EnsureTenantIdIfShould', {
		check: buildConditionalCheck<DataAndValidation>(async ($factor, _, $) => {
			return $.touch($factor.data.tenantCode).isNotBlank().ok();
		}),
		steps: [Steps.loadOneBySQL('FindTenantIdByCode', {
			fromInput: buildFromInput<DataAndValidation, FindTenantQueryBasis>(async ($factor, _, $) => {
				return {params: {tenantCode: $factor.data.tenantCode}};
			}),
			sql: 'SELECT TENANT_ID AS "tenantId" FROM T_TENANT WHERE TENANT_CODE = $tenantCode',
			toOutput: buildToOutput<DataAndValidation, DataAndValidation, Tenanted>(async ($result, $request, $) => {
				const $factor = $request.content;
				$factor.data.tenantId = $result?.tenantId;
				return $factor;
			})
		})]
	});
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
			CleanRequestData,
			PrepareForValidation,
			CheckRequestData,
			ResponseOnValidationNotOkOrElse(
				EnsureTenantIdIfShould
			)
		)
		.publish();
};
