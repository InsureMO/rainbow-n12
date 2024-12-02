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
	DERIVED_TENANT = 'derived',
}

/**
 * Data accessibility by {@link #shareDataToParent} and {@link #shareDataToOrigin} is contagious.
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
	parentTenantId?: TenantId;
	/** includes parent id */
	ancestorTenantIds?: TenantIds;
	/** works only when type is {@link SUBORDINATE_TENANT}, default false */
	shareDataToParent?: boolean;
	originTenantId?: TenantId;
	/** includes origin id */
	originTenantIds?: TenantIds;
	/** works only when type is {@link DERIVED_TENANT}, default false */
	shareDataToOrigin?: boolean;
	/** share data to service provider or not, default true */
	shareDataToServiceProvider?: boolean;
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
	jobTitleId?: RdsId;
	name?: string;
	description?: string;
	/** fk to self */
	parentJobTitleId?: RdsId;
	/** includes parent id */
	ancestorJobTitleIds?: RdsIds;
	/**
	 * share access granted to its parent job title when it is true, and it is contagious
	 * which means ancestor job title has all access from its descendant job titles which this flag is true.
	 */
	shareAccessToParent?: boolean;
	/** fk to {@link Department} */
	deptId?: RdsId;
	/** fk to {@link Organization} */
	organId?: RdsId;
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
}

/**
 *  user can belong to multiple organizations, departments, and with multiple job titles.
 */
export interface UserBelongsTo extends Auditable, Tenanted, OptimisticLock {
	/** sequence */
	belongsToId?: RdsId;
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

