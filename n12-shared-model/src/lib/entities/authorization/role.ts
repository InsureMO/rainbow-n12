import {RdsId} from '../../common';
import {Auditable, OptimisticLock, Tenanted} from '../common';
import {AuthorizedPermissionRestrictions} from './permission';

/**
 * role could belong to one of {@link JobTitle}/{@link Department}/{@link Organization}/{@link Tenant}
 */
export interface Role extends Auditable, Tenanted, OptimisticLock {
	/** sequence */
	roleId?: RdsId;
	/** unique in tenant */
	code?: string;
	description?: string;
	enabled?: boolean;
	/** fk to {@link JobTitle} */
	jobTitleId?: RdsId;
	/** fk to {@link Department} */
	deptId?: RdsId;
	/** fk to {@link Organization} */
	organId?: RdsId;
	/**
	 * inherited by descendants or not, default true
	 * descendant doesn't include sub tenants and derived tenants
	 * role belongs to tenant always be inherited by organ/department/job title in this tenant
	 */
	inherit?: boolean;
	/**
	 * allow cross granting or not, default false.
	 * cannot grant to users that are not in the same job title/department/organ.
	 */
	allowCrossGranting?: boolean;
}

/**
 * permissions granted to role,
 * restrictions might be no/partially/fully declared in this role.
 */
export interface RolePermission extends Auditable, Tenanted, OptimisticLock {
	rpId?: RdsId;
	/** fk to {@link Role} */
	roleId?: RdsId;
	permissionCode?: string;
	/**
	 * leave it null if no permission restriction defined in this role, or no restriction in this permission.
	 */
	restrictions?: AuthorizedPermissionRestrictions;
}
