import {DateTime, TenantCode, TenantId, TenantName, UserId, UserName} from '../common';

export enum RoleRestrictionType {
	SIMPLE = 'simple', COMPLEX = 'complex', AND = 'and', OR = 'or'
}

export interface RoleRestriction<V = any> {
	type: RoleRestrictionType;
	value: V;
}

export interface SimpleRoleRestriction extends RoleRestriction<string | DateTime | number | boolean> {
	type: RoleRestrictionType.SIMPLE;
}

export interface ComplexRoleRestriction<V = any> extends RoleRestriction<V> {
	type: RoleRestrictionType.COMPLEX;
}

export interface JointRoleRestriction extends RoleRestriction<Array<RoleRestrictions>> {
	type: RoleRestrictionType.AND | RoleRestrictionType.OR;
}

export type RoleRestrictions = SimpleRoleRestriction | ComplexRoleRestriction | JointRoleRestriction;

export interface AuthorizedRole {
	code: string;
	restrictions?: Record<string, RoleRestrictions>;
}

export interface Authentication {
	userId: UserId;
	userName?: UserName;
	tenantId?: TenantId;
	tenantCode?: TenantCode;
	tenantName?: TenantName;
	roles?: Array<AuthorizedRole>;
}
