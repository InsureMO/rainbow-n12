import {DateTime, RdsId, UserId} from '../../common';
import {Auditable, AuditCreation, Tenanted} from '../common';
import {ImportConfigType} from './import-type';

/**
 * - Index created, lines importing (might be 0 line imported), {@link IMPORTING}.
 * - All lines imported, and no error detected or all errors fixed, {@link READY}.
 * - All lines imported, but some lines have error, {@link PARTIAL_READY}. available for bulkToNext is false.
 * - Error detected during inspection, {@link INSPECT_ERROR}. available for bulkToNext is true.
 * - Error detected during inspection, but fixed, {@link INSPECT_FIXED}.
 *   once status was switched to {@link STREAMING_WITH_ERROR}, even fixed, it will be switched back to {@link STREAMING} instead of {@link INSPECT_FIXED}.
 * - Lines streaming to next step, {@link STREAMING}.
 * - Lines streaming to next step, but some lines have error, {@link STREAMING_WITH_ERROR}. available for bulkToNext is false.
 * - All lines abandoned, {@link ABANDON}.
 * - All lines done, {@link DONE}. which means for a particular line, status is done or abandon.
 */
export enum ImportDataIndexStatus {
	/** raw data import in progress */
	IMPORTING = 'importing',
	/** raw data imported, ready for next step */
	READY = 'ready',
	/**
	 * raw data imported, partial ready for next step, which means at least one line is on error and waiting for fix
	 * available only on bulkToNext is false.
	 */
	PARTIAL_READY = 'partial-ready',
	/**
	 * error found during inspection, waiting for fix
	 * available only on bulkOnNext is true
	 */
	INSPECT_ERROR = 'inspect-error',
	/** error found during inspection, but fixed */
	INSPECT_FIXED = 'inspect-fixed',
	/** raw data streaming to next step in progress */
	STREAMING = 'streaming',
	/**
	 * raw data streaming to next step in progress, but at least one line is on error and waiting for fix
	 * available only on bulkToNext is false.
	 */
	STREAMING_WITH_ERROR = 'streaming-with-error',
	/** whole raw data abandoned. terminal status */
	ABANDON = 'abandon',
	/**
	 * next step accomplished, all well done. terminal status.
	 * done means all lines are streamed to next step, and no error found.
	 * or some lines were abandoned, but the rest was streamed to next step.
	 */
	DONE = 'done',
}

/**
 * block might be detected by the natual line format, which means the control lines are not mandatory.
 * or in some cases, only control start line is designed, and block ends by next control start line detected,
 * in this case, control end line is not mandatory.
 *
 * and start/end line numbers contains valid data lines and does not include control lines.
 */
export interface ImportDataBlockDetail {
	/** starts from 0 */
	index: number;
	/** type of block */
	type?: string;
	startLineNumber?: number;
	endLineNumber?: number;
	controlStartLineNumber?: number;
	controlEndLineNumber?: number;
	/** all empty line numbers */
	emptyLineNumbers?: Array<number>;
	/**
	 * when a block ending, there still might be some empty lines to EOF or next block,
	 * in this case, the line numbers will be stored here.
	 */
	tailingEmptyLineNumbers?: Array<number>;
}

export type ImportDataBlockDetails = Array<ImportDataBlockDetail>;

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
	/** total lines of imported data, if import type is for single entity, lines is 1. */
	lines?: number;
	/**
	 * total blocks of imported data, if import type is for single entity, blocks is 1.
	 * for structured data, such as json, xml, etc., of course they can be split to blocks, but no block details will be saved.
	 */
	blocks?: number;
	/** block index always starts from 0 */
	blockDetails?: ImportDataBlockDetails;
	/** total empty lines of imported data, if import type is for single entity, empty lines is 0. */
	emptyLines?: number;
	/** total control lines of imported data, if import type is for single entity, control lines is 0. */
	controlLines?: number;
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

/**
 * one-2-one to {@link ImportDataIndex}.
 * could be none, if the raw data is preserved to other place, such as S3, FTP, etc.
 */
export interface ImportedDataRaw {
	/** pk, and fk to {@link ImportDataIndex} */
	importId?: RdsId;
	raw?: Blob;
}

export type ParsedDataPropertyName = string;
export type BaseParsedValue = string | DateTime | number | boolean | null | undefined;
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
	/**
	 * from and to need to appear in pairs, unless the value of one side is `null` or `undefined`.
	 */
	[key: `from-${ParsedDataPropertyName}` | `to-${ParsedDataPropertyName}`]: ParsedValue;
	/**
	 * if inspection error was fixed on this change, log the original error message.
	 */
	[key: `fix-${ParsedDataPropertyName}`]: string;
}

/**
 * - Ready for next step, {@link READY}.
 * - Error found during inspection, waiting for fix, {@link INSPECT_ERROR}.
 * - Error found during inspection, but fixed, {@link INSPECT_FIXED}.
 * - Abandoned, {@link ABANDON}.
 * - Streaming to next step in progress, {@link STREAMING}.
 *   if error occurred during streaming, status will be {@link STREAMING_WITH_ERROR}, and waiting for fix.
 *   streaming error will write the error into line.
 * - Next step accomplished, {@link DONE}.
 */
export enum ImportDataLineStatus {
	/** ready for next step */
	READY = 'ready',
	/** error found during inspection, waiting for fix */
	INSPECT_ERROR = 'inspect-error',
	/** error found during inspection, but fixed */
	INSPECT_FIXED = 'inspect-fixed',
	/** abandoned */
	ABANDON = 'abandon',
	/** streaming to next step in progress */
	STREAMING = 'streaming',
	/** error occurred during streaming */
	STREAMING_WITH_ERROR = 'streaming-with-error',
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
	/** block index, starts from 0 */
	blockIndex?: number;
	/** block type, same as {@link ImportDataBlockDetail#type} which has same block index */
	blockType?: string;
	/**
	 * parsed data, any type is ok, just to store the parsed data.
	 */
	parsed?: ParsedData;
	/**
	 * group keys for lines, make sure all lines which need to be grouped have the same group keys.
	 * used in merge step and take effective in one import transaction.
	 */
	groupKeys?: string;
	/**
	 * raw data, any type is ok, just to store the raw data.
	 * e.g. from csv, raw is a string. from json, raw might be a json object.
	 * from xlsx, raw might be an in-memory object, but it will be stored as a json object anyway.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	raw?: any;
	/** status of imported line */
	status?: ImportDataLineStatus;
	/**
	 * error message or stack if status is error and error occurs on this line, not on field
	 * e.g. error occurred on next action, and if there is error on multiple lines, same error will be stored on each line
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
	/** streaming error occurred at */
	streamingErrorAt?: DateTime;
	/** done at, means data was proceeded by next step */
	doneAt?: DateTime;
}

export interface ImportDataLineChanges extends AuditCreation {
	/** sequence */
	changeId?: RdsId;
	/** fk to {@link ImportDataLine} */
	lineId?: RdsId;
	/** any changes on this line */
	changes?: ParsedDataChange;
}
