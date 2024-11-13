import {DateTime, TenantId, UserId} from '../common';

export interface Auditable {
	createdAt?: DateTime;
	createdBy?: UserId;
	lastModifiedAt?: DateTime;
	lastModifiedBy?: UserId;
}

export interface Tenanted {
	tenantId?: TenantId;
}

export enum ConfigChangeType {
	MANUAL_UPGRADE = 'manual-upgrade',
	RECOVERY = 'recovery',
}
