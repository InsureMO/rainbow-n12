import {DateTime, RdsId} from '../../common';
import {Auditable, OptimisticLock, Tenanted} from '../common';

export enum LoginLockStrategy {
	LOCK_UNTIL_MANUAL_UNLOCK = 'lumu',
	LOCK_UNTIL_TIME = 'lut'
}

export interface SystemLoginLockStrategy extends Auditable, Tenanted, OptimisticLock {
	/** sequence */
	strategyId?: RdsId;
	/** when try times exceed this value, do lock */
	tryTimes?: number;
	strategy?: LoginLockStrategy;
	/** available when strategy is {@link LoginLockStrategy#LOCK_UNTIL_TIME} */
	minutes?: number;
	enabled?: boolean;
}

export interface UserLogin extends Auditable, Tenanted, OptimisticLock {
	/** sequence, fk to {@link User}, one-2-one */
	userId?: RdsId;
	password?: string;
	twoFactorEnabled?: boolean;
	maxEquipments?: number;
	/** no value means user not been locked */
	lockStrategy?: LoginLockStrategy;
	/** available when lock strategy is {@link LoginLockStrategy#LOCK_UNTIL_TIME} */
	unlockUntil?: DateTime;
}

export enum LoginMode {
	USER_PWD = 'pwd',
	REFRESH_TOKEN = 'refresh-token',
	LONG_TERM_TOKEN = 'long-term-token',
	SSO = 'sso'
}

export interface UserLoginLog extends Auditable, Tenanted {
	/** sequence */
	logId?: RdsId;
	/** fk to {@link User} */
	userId?: RdsId;
	mode?: LoginMode;
	/** authenticated or not */
	authenticated?: boolean;
	/** true when authenticated, and token signature issued */
	tokenIssued?: boolean;
	/** token signature issued */
	token?: string;
	/** ip from client */
	ip?: boolean;
	/** fingerprint from client */
	fingerprint?: string;
	/** second factor when two factor enabled, and authenticated this round */
	secondFactor?: string;
	/** leave empty when two factor not enabled, or second factor not from this service */
	secondFactorExpiryAt?: DateTime;
	/** fail reason code */
	failReasonCode?: string;
	/** fail reason */
	failReason?: string;
	/** try times after last success login */
	consecutiveTryTimes?: number;
}

