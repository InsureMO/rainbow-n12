import {Tenant} from '@rainbow-n12/shared-model';
import {ServerConfig} from '../../../server-envs';
import {PreparedDataAndValidation, PrepareForValidation} from '../../common';
import {buildSnippet, deleteFieldsForCreation, RestApiPublisher, Steps} from '../../utils';
import {OrganizationApis, OrganizationErrorCodes, OrganizationPermissions} from '../constants';

export const CreateTenant = () => {
	const CleanRequestData = Steps.snippet('CleanRequestData', {
		snippet: buildSnippet<Tenant, Tenant>(async ($factor, _, $) => {
			return deleteFieldsForCreation($factor);
		})
	});
	const CheckTenantId = Steps.snippet('CheckTenantId', {
		snippet: buildSnippet<PreparedDataAndValidation<Tenant>, PreparedDataAndValidation<Tenant>>(async ($factor, _, $) => {
			$.touch($factor.data.tenantId).isNotBlank().success(() => {
				$factor.validationResult.error(OrganizationErrorCodes.TenantIdMustNotProvided).message('Tenant ID must not be provided').at('tenantId');
			});
			return $factor;
		})
	});

	return RestApiPublisher
		.use(OrganizationApis.CreateTenant)
		.permissions(OrganizationPermissions.CreateTenant)
		.enable(ServerConfig.MULTIPLE_TENANT_ENABLED)
		.steps(
			CleanRequestData,
			PrepareForValidation,
			CheckTenantId
		)
		.publish();
};
