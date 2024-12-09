import {PermissionCode, RdsId} from '../../common';
import {Auditable, OptimisticLock, Tenanted} from '../common';
import {PermissionRestrictions} from './permission-restriction';

/**
 * permission is maintained by application, static.
 * restrictions values might be no/partially/fully declared in this permission.
 */
export interface Permission {
	code?: PermissionCode;
	description?: string;
	restrictions?: PermissionRestrictions;
}

/**
 * tenant permissions
 */
export interface TenantPermission extends Tenanted, Auditable, OptimisticLock {
	tpId?: RdsId;
	code?: PermissionCode;
	/** ignore {@link #description} and {@link #restrictions} when false, and code must exist in system permission definitions */
	tenantSpecific?: boolean;
	description?: string;
	restrictions?: PermissionRestrictions;
}
