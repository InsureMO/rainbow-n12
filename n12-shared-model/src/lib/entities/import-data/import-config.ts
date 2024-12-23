import {PipelineCode, RdsId} from '../../common';
import {Auditable, ConfigChangeType, OptimisticLock, Tenanted} from '../common';
import {ImportConfigType} from './import-type';

export interface ImportDataPreservative {
	code?: PipelineCode;
	// TODO properties for preserve data
}

export interface ImportDataSplitter {
	code?: PipelineCode;
	// TODO properties for split data
}

export interface ImportDataParser {
	code?: PipelineCode;
	// TODO properties for parse data
}

export interface ImportDataInspector {
	code?: PipelineCode;
	// TODO properties for inspect data
}

export interface ImportDataGrouper {
	code?: PipelineCode;
	// TODO properties for compute group key
}

export interface ImportDataPersister {
	code?: PipelineCode;
	// TODO properties for persist data
}

export interface ImportConfigMeta {
	/** preserve scene, for whole import data */
	preserve?: ImportDataPreservative;
	/**
	 * split import data to multiple lines.
	 * treated as single line if split not declared.
	 */
	split?: ImportDataSplitter;
	/** parse import data, for single line */
	parse?: ImportDataParser;
	/** abandon on parse error or not, for single line */
	abandonOnParseError?: boolean;
	/** inspect import data, for single line */
	inspect?: ImportDataInspector;
	/** abandon on inspect error or not, for single line */
	abandonOnInspectError?: boolean;
	/** compute group key, for single line */
	group?: ImportDataGrouper;
	/** persist import data, for single line */
	persist?: ImportDataPersister;
	/**
	 * data should be streamed to next step in bulk or not.
	 * if not, once line is inspected with no error or error fixed, it will be streamed to next step.
	 * typically, if lines are independent, use false to improve timeliness.
	 * - for scenarios that require grouping multiple rows, use "true" to ensure that no lines are missed during the grouping operation due to any lines on error.
	 * - for scenarios that lines depends on other lines, use "true" to ensure all lines are streamed on exactly importing order.
	 */
	bulkToNext?: boolean;
}

export interface ImportConfig extends Auditable, Tenanted, OptimisticLock {
	/** sequence */
	configId?: RdsId;
	/** unique index */
	code?: string;
	name?: string;
	enabled?: boolean;
	description?: string;
	type?: ImportConfigType;
	meta?: ImportConfigMeta;
}

/**
 * import configuration log, always inserted by system.
 */
export interface ImportConfigLog extends ImportConfig {
	logId?: RdsId;
	changeType?: ConfigChangeType;
}
