import {PermissionCode, TenantCode, TenantId, TenantName, UserId, UserName} from '../common';

export interface Authentication {
	userId: UserId;
	userName?: UserName;
	tenantId?: TenantId;
	tenantCode?: TenantCode;
	tenantName?: TenantName;
	permissions?: Array<PermissionCode>;
}
