import {RdsId, RoleCode} from '../../common';
import {Auditable, OptimisticLock, Tenanted} from '../common';
import {AuthorizedPermissionRestrictions} from './permission-restriction';

/**
 * role could belong to one of {@link JobTitle}/{@link Department}/{@link Organization}/{@link Tenant}
 */
export interface Role extends Auditable, Tenanted, OptimisticLock {
	/** sequence */
	roleId?: RdsId;
	/** unique in tenant */
	code?: RoleCode;
	description?: string;
	enabled?: boolean;
	/** fk to {@link JobTitle}, user with this job title then get this role automatically */
	jobTitleId?: RdsId;
	/** fk to {@link Department}, this role can be granted to users who in this department */
	deptId?: RdsId;
	/** fk to {@link Organization}, this role can be granted to users who in this organization */
	organId?: RdsId;
	/**
	 * inherited by descendants or not, default true
	 * descendant doesn't include sub tenants and derived tenants
	 * role belongs to tenant always be inherited by organ/department/job title in this tenant
	 */
	inherit?: boolean;
	/**
	 * allow cross granting or not, default false.
	 * cannot grant to users that are not in the same department/organ.
	 */
	allowCrossGranting?: boolean;
}

/**
 * permissions granted to role,
 * restrictions has the same structure with it in permission, and values might be no/partially/fully declared in this role.
 */
export interface RolePermission extends Auditable, Tenanted, OptimisticLock {
	rpId?: RdsId;
	/** fk to {@link Role} */
	roleId?: RdsId;
	/** permission must be granted to tenant */
	permissionCode?: string;
	/**
	 * leave it null if no permission restriction defined in this role, or no restriction in this permission.
	 */
	restrictions?: AuthorizedPermissionRestrictions;
}
