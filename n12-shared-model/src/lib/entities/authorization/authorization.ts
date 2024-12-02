import {RdsId, UserId} from '../../common';
import {Auditable, OptimisticLock, Tenanted} from '../common';
import {AuthorizedPermissionRestrictions} from './permission';

export interface UserRolePermission extends Auditable, Tenanted, OptimisticLock {
	urpId?: RdsId;
	/** fk to {@link User} */
	userId?: UserId;
	/**
	 * fk to {@link RolePermission}
	 * if permission is granted by permission directly, this field is null
	 */
	rolePermissionId?: RdsId;
	permissionCode?: string;
	restrictions?: AuthorizedPermissionRestrictions;
}
