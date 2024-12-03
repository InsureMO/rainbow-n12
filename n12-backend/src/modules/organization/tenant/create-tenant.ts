import {Tenant, TenantType} from '@rainbow-n12/shared-model';
import {ServerConfig} from '../../../server-envs';
import {PreparedDataAndValidation, PrepareForValidation, ResponseOnValidationNotOk} from '../../common';
import {buildSnippet, deleteFieldsForCreation, RestApiPublisher, Steps} from '../../utils';
import {
	AllowCreateTenant,
	ErrTenantCodeMustProvided,
	ErrTenantDerivationNotSupported,
	ErrTenantHierarchyNotSupported,
	ErrTenantIdMustNotProvided,
	ErrTenantNameMustProvided,
	ErrTenantTypeMustProvided,
	ErrTenantTypeNotSupported,
	RestApiCreateTenant
} from '../constants';

export const CreateTenant = () => {
	const CleanRequestData = Steps.snippet('CleanRequestData', {
		snippet: buildSnippet<Tenant, Tenant>(async ($factor, _, $) => {
			deleteFieldsForCreation($factor);
			// tenant ids of hierarchy is useless and system will fill it automatically
			delete $factor.ancestorTenantIds;
			delete $factor.originTenantIds;
			return $factor;
		})
	});
	const CheckTenantId = Steps.snippet('CheckTenantId', {
		snippet: buildSnippet<PreparedDataAndValidation<Tenant>, PreparedDataAndValidation<Tenant>>(async ($factor, _, $) => {
			const {data, validationResult: validation} = $factor;
			$.touch(data.tenantId).isNotBlank().success(() => validation.error(ErrTenantIdMustNotProvided).message('Tenant id must not be provided.').at('tenantId'));
			return $factor;
		})
	});
	const CheckOtherFields = Steps.snippet('CheckOtherFields', {
		snippet: buildSnippet<PreparedDataAndValidation<Tenant>, PreparedDataAndValidation<Tenant>>(async ($factor, _, $) => {
			const {data, validationResult: validation} = $factor;
			$.touch(data.code).isBlank().success(() => validation.error(ErrTenantCodeMustProvided).message('Tenant code must be provided.').at('code'));
			$.touch(data.name).isBlank().success(() => validation.error(ErrTenantNameMustProvided).message('Tenant name must be provided.').at('name'));
			$.touch(data.type).isBlank()
				.success(() => validation.error(ErrTenantTypeMustProvided).message('Tenant type must be provided.').at('type'));
			const availableTenantTypes = [TenantType.TENANT, TenantType.SUBORDINATE_TENANT, TenantType.DERIVED_TENANT];
			$.touch(data.type).isNotBlank().isNotAnyOf(TenantType.TENANT, TenantType.SUBORDINATE_TENANT, TenantType.DERIVED_TENANT)
				.success(() => validation.error(ErrTenantTypeNotSupported)
					.message(`Tenant type must be one of [${availableTenantTypes.map(t => `${t}`).join(', ')}].`).at('type'));
			// check hierarchy and derivation
			switch (data.type) {
				case TenantType.TENANT:
					$.touch(data.parentTenantId).isNotBlank()
						.success(() => validation.error(ErrTenantHierarchyNotSupported)
							.message(`Tenant type[${TenantType.TENANT}] doesn't support hierarchy, it's top level.`).at('parentTenantId'));
					$.touch(data.originTenantId).isNotBlank()
						.success(() => validation.error(ErrTenantDerivationNotSupported)
							.message(`Tenant type[${TenantType.TENANT}] doesn't support derivation, it's top level.`).at('originTenantId'));
					break;
				case TenantType.SUBORDINATE_TENANT:
					$.touch(data.originTenantId).isNotBlank()
						.success(() => validation.error(ErrTenantDerivationNotSupported)
							.message(`Tenant type[${TenantType.SUBORDINATE_TENANT}] doesn't support derivation, it's subordinate.`).at('originTenantId'));
					break;
				case TenantType.DERIVED_TENANT:
					$.touch(data.parentTenantId).isNotBlank()
						.success(() => validation.error(ErrTenantHierarchyNotSupported)
							.message(`Tenant type[${TenantType.DERIVED_TENANT}] doesn't support hierarchy, it's derived.`).at('parentTenantId'));
					break;
			}
			return $factor;
		})
	});

	return RestApiPublisher
		.use(RestApiCreateTenant)
		.permissions(AllowCreateTenant)
		.enable(ServerConfig.MULTIPLE_TENANT_ENABLED)
		.steps(
			CleanRequestData,
			PrepareForValidation,
			CheckTenantId,
			ResponseOnValidationNotOk([
				CheckOtherFields
			])
		)
		.publish();
};
