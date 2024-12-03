import {asRestApi} from '../utils';

export const OrganizationApis = {
	CreateTenant: asRestApi('CreateTenant', '/tenant/create', 'post'),
	UpdateTenant: asRestApi('UpdateTenant', '/tenant/update', 'post'),
	EnableTenant: asRestApi('EnableTenant', '/tenant/enable', 'post')
};

export const OrganizationPermissions = {
	CreateTenant: 'CreateTenant'
};

export const OrganizationErrorCodes = {
	TenantIdMustNotProvided: 'N12-ORG-00001'
};
