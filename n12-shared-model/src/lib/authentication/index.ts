import {TenantCode, TenantId, TenantName, UserId, UserName} from '../common';
import {AuthorizedPermissionRestrictions} from '../entities/authorization';

export interface AuthorizedRolePermission {
	/** permission code, actually */
	code: string;
	restrictions?: AuthorizedPermissionRestrictions;
}

export interface Authentication {
	userId: UserId;
	userName?: UserName;
	tenantId?: TenantId;
	tenantCode?: TenantCode;
	tenantName?: TenantName;
	roles?: Array<AuthorizedRolePermission>;
}
