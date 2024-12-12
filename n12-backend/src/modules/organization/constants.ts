import {asRestApi} from '../utils';

// rest apis
export const RestApiCreateTenant = asRestApi('CreateTenant', '/tenant/create', 'post');
export const RestApiUpdateTenant = asRestApi('UpdateTenant', '/tenant/update', 'post');
export const RestApiEnableTenant = asRestApi('EnableTenant', '/tenant/enable', 'post');

// permissions
export const AllowCreateTenant = 'CreateTenant';

// errors
export const ErrTenantIdMustNotProvided = 'N12-ORG-00001';
export const ErrTenantCodeMustProvided = 'N12-ORG-00002';
export const ErrTenantNameMustProvided = 'N12-ORG-00003';
export const ErrTenantTypeMustProvided = 'N12-ORG-00004';
export const ErrTenantTypeNotSupported = 'N12-ORG-00005';
export const ErrTenantHierarchyNotSupported = 'N12-ORG-00006';
export const ErrTenantDerivationNotSupported = 'N12-ORG-00007';

