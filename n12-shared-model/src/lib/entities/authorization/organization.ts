import {RdsId, RdsIds, TenantId, TenantIds, UserId, UserName} from '../../common';
import {Auditable, OptimisticLock, Tenanted} from '../common';

export enum TenantType {
	/**
	 * who is owner of this service, super administrator,
	 * can visit all data, even it is from other tenant
	 */
	SERVICE_PROVIDER = 'service-provider',
	/**
	 * top level tenant,
	 * can visit its own data and its subordinates' data
	 */
	TENANT = 'tenant',
	/**
	 * tenant subordinate to other tenant
	 */
	SUBORDINATE_TENANT = 'subordinate',
	/**
	 * tenant derived from other tenant
	 * can visit its own data and its subordinates' data
	 */
	DERIVED_TENANT = 'derived'
}

/**
 * Data accessibility by {@link #shareDataToParent} and {@link #shareDataToOrigin} is contagious.
 * service provider doesn't allow derived and subordinate tenant,
 * other types allows subordinate tenant,
 * subordinate tenant doesn't allow derived tenant.
 */
export interface Tenant extends Auditable, OptimisticLock {
	/** sequence */
	tenantId?: TenantId;
	/** cannot change once created */
	code?: string;
	name?: string;
	/** cannot change by itself */
	enabled?: boolean;
	description?: string;
	/** cannot change once created */
	type?: TenantType;
	/** for {@link SUBORDINATE_TENANT} */
	parentTenantId?: TenantId;
	/** includes parent id */
	ancestorTenantIds?: TenantIds;
	/** works only when type is {@link SUBORDINATE_TENANT}, default false */
	shareDataToParent?: boolean;
	/** for {@link DERIVED_TENANT} */
	originTenantId?: TenantId;
	/** includes origin id */
	originTenantIds?: TenantIds;
	/** works only when type is {@link DERIVED_TENANT}, default false */
	shareDataToOrigin?: boolean;
	/** share data to service provider or not, default true. */
	shareDataToServiceProvider?: boolean;
	/** allow subordinate tenant or not, default false. always false for {@link SERVICE_PROVIDER} */
	allowSubordinate?: boolean;
	/** allow derived tenant or not, default false. always false for {@link SERVICE_PROVIDER} and {@link SUBORDINATE_TENANT} */
	allowDerived?: boolean;
}

export interface Organization extends Auditable, Tenanted, OptimisticLock {
	/** sequence */
	organId?: RdsId;
	name?: string;
	description?: string;
	/** fk to self */
	parentOrganId?: RdsId;
	/** includes parent id */
	ancestorOrganIds?: RdsIds;
	enabled?: boolean;
}

export interface Department extends Auditable, Tenanted, OptimisticLock {
	/** sequence */
	deptId?: RdsId;
	name?: string;
	description?: string;
	/** fk to self */
	parentDeptId?: RdsId;
	/** includes parent id */
	ancestorDeptIds?: RdsIds;
	/** fk to {@link Organization} */
	organId?: RdsId;
	enabled?: boolean;
}

export interface JobTitle extends Auditable, Tenanted, OptimisticLock {
	/** sequence */
	jobTitleId?: RdsId;
	name?: string;
	description?: string;
	/** fk to {@link Department} */
	deptId?: RdsId;
	/** fk to {@link Organization} */
	organId?: RdsId;
	enabled?: boolean;
}

/**
 * job title can be shared to
 * 1. within same tenant, organization or department
 * 2. cross tenant, and the origin tenant must be subordinate or derived of the share to tenant
 */
export interface JobTitleShareTo extends Auditable, OptimisticLock {
	/** sequence */
	shareToId?: RdsId;
	/** fk to {@link JobTitle} */
	fromJobTitleId: RdsId;
	/** fk to {@link JobTitle} */
	toJobTitleId?: RdsId;
	enabled?: boolean;
}

export interface User extends Auditable, Tenanted, OptimisticLock {
	/** sequence */
	userId?: UserId;
	userName?: UserName;
	displayName?: UserName;
	firstName?: string;
	middleName?: string;
	lastName?: string;
	email?: string;
	mobile?: string;
	enabled?: boolean;
	/** fk to {@link JobTitle} */
	jobTitleId?: RdsId;
	/** fk to {@link Department} */
	deptId?: RdsId;
	/** fk to {@link Organization} */
	organId?: RdsId;
}

/**
 *  user can work in multiple organizations, departments, and with multiple job titles.
 */
export interface UserWorkIn extends Auditable, Tenanted, OptimisticLock {
	/** sequence */
	workInId?: RdsId;
	/** fk to {@link User} */
	userId?: RdsId;
	/** fk to {@link JobTitle} */
	jobTitleId?: RdsId;
	/** fk to {@link Department} */
	deptId?: RdsId;
	/** fk to {@link Organization} */
	organId?: RdsId;
	enabled?: boolean;
}
