import {DateTime} from '../../common';

export type PermissionRestrictionValueType =
	| 'string' | 'datetime' | 'number' | 'boolean'
	| 'm-string' | 'm-datetime' | 'm-number'
	| 'r-datetime' | 'r-number'
	| 'complex' | 'and' | 'or';

export interface PermissionRestriction<T extends PermissionRestrictionValueType = PermissionRestrictionValueType> {
	type: T;
	/** value required, default false */
	valueRequired?: boolean;
}

export type PermissionRestrictions = PermissionRestriction;

/**
 * permission is maintained by application, static.
 */
export interface Permission {
	code?: string;
	description?: string;
	restrictions: PermissionRestrictions;
}

export interface AuthorizedPermissionRestriction<T extends PermissionRestrictionValueType = PermissionRestrictionValueType> extends PermissionRestriction<T> {
	params?: T extends 'string' ? string
		: T extends 'number' ? number
			: T extends 'datetime' ? DateTime
				: T extends 'boolean' ? boolean
					: T extends 'm-string' ? Array<string>
						: T extends 'm-number' ? Array<number>
							: T extends 'm-datetime' ? Array<DateTime>
								: T extends 'r-datetime' ? [DateTime, DateTime]
									: T extends 'r-number' ? [number, number]
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										: T extends 'complex' ? any
											: T extends 'and' | 'or' ? Array<AuthorizedPermissionRestriction>
												// eslint-disable-next-line @typescript-eslint/no-explicit-any
												: any;
}

export type AuthorizedPermissionRestrictions = AuthorizedPermissionRestriction;
