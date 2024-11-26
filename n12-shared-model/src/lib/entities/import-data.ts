import {DateTime, RdsId, UserId} from '../common';
import {Auditable, Tenanted} from './common';
import {ImportConfigType} from './import-type';

/**
 * 1. index created and line still in progress: importing
 * 2. all lines imported, but has inspection error: error
 * 3. all lines imported, with all inspection errors fixed: fixed
 * 4. no inspection error found: ready
 * 5. abandon by system, or manually: abandon
 * 6. start to stream to next step: streaming
 * 7. all lines available to next have been streamed to next step: done
 *
 * possible status flow:
 * 1. importing -> abandon: all data abandoned
 * 2. importing -> ready: all data ready for next step
 * 3. importing -> error: at least one line in error status
 * 4. importing -> error -> fixed: at least one line in error status, and all inspection errors fixed
 * 5. ready or error or fixed -> abandon: all data abandoned
 * 6. ready or fixed -> streaming -> done: lines not flagged as abandoned is streamed to next step.
 * 7. ready or fixed -> streaming -> abandon: partial data was streamed to next step, and the rest was abandoned.
 * 8. error could be occurred after ready and fixed, if inspection error found after that.
 * 9. abandon after streaming might be caused by timeout or other system issue to interrupt the streaming.
 */
export enum ImportDataIndexStatus {
	/** raw data import in progress */
	IMPORTING = 'importing',
	/** raw data imported, ready for next step */
	READY = 'ready',
	/** error found during inspection, waiting for fix */
	ERROR = 'error',
	/** error found during inspection, but fixed */
	FIXED = 'fixed',
	/** whole raw data abandoned */
	ABANDON = 'abandon',
	/** raw data streaming to next step in progress */
	STREAMING = 'streaming',
	/** next step accomplished, all well done */
	DONE = 'done',
}

export interface ImportDataIndex extends Auditable, Tenanted {
	/** sequence */
	importId?: RdsId;
	code?: string;
	name?: string;
	type?: ImportConfigType;
	/**
	 * could be anything, just to log the source name if there is,
	 * such as file name, s3 path, table name, etc.
	 * leave it empty when data is imported by api
	 */
	sourceName?: string;
	/**
	 * reference id to the raw data, which given by import data preservative.
	 * or leave it empty when no return from import data preservative or preservative not declared.
	 */
	rawReference?: string;
	/**
	 * lines of imported data, if import type is for single entity, lines is 1.
	 */
	lines?: number;
	/** status of imported data, for whole data */
	status?: ImportDataIndexStatus;
	/** raw data import start time */
	importedAt?: DateTime;
	/** raw data ready at, means no inspection error anymore */
	readyAt?: DateTime;
	/** raw data abandoned at, could be abandoned by configuration + system, or manually */
	abandonedAt?: DateTime;
	/** raw data abandoned by */
	abandonedBy?: UserId;
	/** raw data streaming starts at, means data is proceeding to next step */
	streamingAt?: DateTime;
	/** raw data done at, means data was proceeded by next step */
	doneAt?: DateTime;
}

export type ParsedDataPropertyName = string;
export type BaseParsedValue = string | number | boolean | null | undefined;
/**
 * $err is reserved key for inspection error found
 */
export type InspectErrorValue = { raw?: string, parsed?: ParsedValue, $err?: string };
export type ParsedValue =
	BaseParsedValue
	| Array<ParsedValue>
	| { [key: ParsedDataPropertyName]: ParsedValue }
	| InspectErrorValue;
export type ParsedData = Record<ParsedDataPropertyName, ParsedValue>;

export interface ParsedDataChange {
	changedAt?: DateTime;
	changedBy?: UserId;
	/**
	 * from and to need to appear in pairs, unless the value of one side is `null` or `undefined`, or one side is an empty string.
	 */
	[key: `from-${ParsedDataPropertyName}` | `to-${ParsedDataPropertyName}`]: ParsedValue;
	/**
	 * if inspection error was fixed on this change, log the original error message.
	 */
	[key: `fix-${ParsedDataPropertyName}`]: string;
}

export type ParsedDataChanges = Array<ParsedDataChange>;

/**
 * 1. ready for next step: ready
 * 2. error found during inspection: error
 * 3. error found during inspection, but fixed: fixed, equals to ready
 * 4. abandoned: abandon
 * 5. streaming to next step in progress: streaming
 * 6. next step accomplished: done
 *
 * possible status flow:
 * 1. ready -> abandon: line abandoned
 * 2. ready -> streaming -> done: line streamed to next step.
 * 3. error -> fixed -> abandon: line abandoned
 * 4. error -> fixed -> streaming -> done: line streamed to next step.
 * 5. error -> abandon: line abandoned
 * 6. error could be occurred after ready and fixed, if inspection error found after that.
 * 7. abandon after streaming might be caused by timeout or other system issue to interrupt the streaming.
 */
export enum ImportDataLineStatus {
	/** ready for next step */
	READY = 'ready',
	/** error found during inspection, waiting for fix */
	ERROR = 'error',
	/** error found during inspection, but fixed */
	FIXED = 'fixed',
	/** abandoned */
	ABANDON = 'abandon',
	/** streaming to next step in progress */
	STREAMING = 'streaming',
	/** next step accomplished */
	DONE = 'done',
}

export interface ImportDataLine extends Auditable, Tenanted {
	/** sequence */
	lineId?: RdsId;
	/** fk to {@link ImportDataIndex} */
	importId?: RdsId;
	/**
	 * sometimes import data format has their natural index, partIndex just follows it.
	 * e.g. sheetIndex for xlsx.
	 */
	partIndex?: string;
	/**
	 * line number in the import data, exactly matched import data format.
	 * e.g. starts from 0 if given data is an array, or starts from 1 if given data is a csv which with no header line.
	 */
	lineNumber?: number;
	/**
	 * parsed data, any type is ok, just to store the parsed data.
	 */
	parsed?: ParsedData;
	/**
	 * group key for lines, make sure all lines which need to be grouped have the same group key.
	 * used in merge step and take effective in one import transaction.
	 */
	groupKey?: string;
	/** any changes on this line */
	changes?: ParsedDataChanges;
	/**
	 * raw data, any type is ok, just to store the raw data.
	 * e.g. from csv, raw is a string. from json, raw might be a json object. from xlsx, raw might be an in-memory object.
	 * but it will be stored as a json object anyway.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	raw?: any;
	/** status of imported line */
	status?: ImportDataLineStatus;
	/**
	 * error message or stack if status is error and error occurs on this line, not on field
	 * e.g. error occurred on next action, and if there is error on multiple lines, error will be stored in first line only
	 */
	error?: string;
	/** ready at, means no inspection error anymore */
	readyAt?: DateTime;
	/** abandoned at, could be abandoned by configuration + system, or manually */
	abandonedAt?: DateTime;
	/** abandoned by */
	abandonedBy?: UserId;
	/** streaming starts at, means data is proceeding to next step */
	streamingAt?: DateTime;
	/** done at, means data was proceeded by next step */
	doneAt?: DateTime;
}
