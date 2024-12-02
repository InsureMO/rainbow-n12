import {DateTime, TenantId, UserId} from '../common';

export interface AuditCreation {
	createdAt?: DateTime;
	createdBy?: UserId;
}

export interface Auditable extends AuditCreation {
	lastModifiedAt?: DateTime;
	lastModifiedBy?: UserId;
}

export interface OptimisticLock {
	version?: number;
}

export interface Tenanted {
	tenantId?: TenantId;
}

export enum ConfigChangeType {
	MANUAL_UPGRADE = 'manual-upgrade',
	RECOVERY = 'recovery',
}
