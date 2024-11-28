import {DateTime} from '../common';
import {InteractionRequest} from './request';
import {SuccessInteractionResponse} from './response';

export type CodeTableItemCode = string;

export interface CodeTableItem {
	code: CodeTableItemCode;
	label: string;
}

export type CodeTableCode = string;

export interface AskCodeTableRequest extends InteractionRequest {
	code: CodeTableCode;
	/** no last updated represents asking all items */
	lastUpdated?: DateTime;
}

export interface CodeTable {
	code: CodeTableCode;
	items: Array<CodeTableItem>;
	lastUpdated: DateTime;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AskCodeTableResponse extends SuccessInteractionResponse<CodeTable> {
}
