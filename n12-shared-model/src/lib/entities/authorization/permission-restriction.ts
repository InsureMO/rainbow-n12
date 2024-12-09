import {DateTime} from '../../common';

export interface PermissionRestrictionValueTypes {
	text: string;
	datetime: DateTime;
	number: number;
	boolean: boolean;
	texts: [string, ...string[]];
	numbers: [number, ...number[]];
	datetimeRange: [undefined, DateTime] | [DateTime, undefined] | [DateTime, DateTime];
	numberRange: [undefined, number] | [number, undefined] | [number, number];
	conjunction: [PermissionRestriction<keyof PermissionRestrictionValueTypes>, ...PermissionRestriction<keyof PermissionRestrictionValueTypes>[]];
}

/**
 * eq: equals
 * ne: not equals
 * lt: less than
 * lte: less than or equals
 * gt: greater than
 * gte: greater than or equals
 * in: in
 * ni: not in
 * c: closed range
 * o: open range
 * lo: left open range
 * ro: right open range
 */
export interface PermissionRestrictionValueOperators {
	text: 'eq' | 'ne';
	datetime: 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte';
	number: 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte';
	boolean: 'eq';
	texts: 'in' | 'ni';
	numbers: 'in' | 'ni';
	datetimeRange: 'c' | 'o' | 'lo' | 'ro';
	numberRange: 'c' | 'o' | 'lo' | 'ro';
	conjunction: 'and' | 'or';
}

/**
 * {@link #operator} and {@link #value} are optional, it just defines that what the restriction is.
 * and they must have values when {@link #valueRequired} is true on restriction authorized.
 */
export interface PermissionRestriction<T extends keyof PermissionRestrictionValueTypes> {
	name: string;
	type: T;
	operator?: PermissionRestrictionValueOperators[T];
	value?: PermissionRestrictionValueTypes[T];
	valueRequired?: boolean;
}

export type PermissionRestrictions =
	| PermissionRestriction<keyof PermissionRestrictionValueTypes>
	| Array<PermissionRestriction<keyof PermissionRestrictionValueTypes>>;

export type AuthorizedPermissionRestriction = Omit<PermissionRestriction<keyof PermissionRestrictionValueTypes>, 'valueRequired'>;

export type AuthorizedPermissionRestrictions =
	| AuthorizedPermissionRestriction
	| Array<AuthorizedPermissionRestriction>;
