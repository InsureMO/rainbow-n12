// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyValue = any;
export type Undefinable<T> = T | undefined | null;
export type Nullable<T> = T | null;

/** might be a number, such as snowflake. */
export type RdsId = string;
/** rds ids concatenated by comma */
export type RdsIds = string;
/** always follows format YYYY/MM/DD HH:mm:ss. ignore millisecond part. */
export type DateTime = string;

/** could be number or string */
export type UserId = string;
export type UserName = string;

/** could be number or string */
export type TenantId = string;
export type TenantCode = string;
export type TenantName = string;
/** tenant ids concatenated by comma */
export type TenantIds = string;

export type PipelineCode = string;
