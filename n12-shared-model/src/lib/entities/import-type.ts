export enum ImportConfigType {
	API = 'api',
	CSV = 'csv',
	EDI = 'edi',
	XLSX = 'xlsx',
	JSON = 'json',
	/** an entity each line, each line is a well-formed json */
	JSON_LINES = 'jsonl',
	XML = 'xml',
	/** includes view, for single table/view */
	TABLE = 'table',
	SQL = 'sql'
}
