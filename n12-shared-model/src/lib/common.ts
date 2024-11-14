// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyValue = any;
export type Undefinable<T> = T | undefined | null;
export type Nullable<T> = T | null;

/** might be a number, such as snowflake. */
export type RdsId = string;
export type UserId = string;
/** always follows format YYYY/MM/DD HH:mm:ss. ignore millisecond part. */
export type DateTime = string;

export type TenantId = string;

export type PipelineCode = string;
