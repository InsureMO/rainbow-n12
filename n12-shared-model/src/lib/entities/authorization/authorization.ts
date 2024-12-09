import {PermissionCode, RdsId, UserId} from '../../common';
import {Auditable, OptimisticLock, Tenanted} from '../common';
import {AuthorizedPermissionRestrictions} from './permission-restriction';

export interface UserRolePermission extends Auditable, Tenanted, OptimisticLock {
	urpId?: RdsId;
	/** fk to {@link User} */
	userId?: UserId;
	/** fk to {@link Role}, leave it null if granting permission directly */
	roleId?: RdsId;
	/** fk to {@link RolePermission}, leave it null if granting permission directly */
	rolePermissionId?: RdsId;
	/** fk to {@link Permission} */
	permissionCode?: PermissionCode;
	/**
	 * same structure with permission, values declared.
	 * or leave it null to use the restrictions defined in role/permission
	 * if any restriction is declared as value required, and its value not declared in role/permission,
	 * then copy all restrictions to here
	 */
	restrictions?: AuthorizedPermissionRestrictions;
}
