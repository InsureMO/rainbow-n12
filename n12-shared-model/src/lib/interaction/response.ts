import {ValidateItem} from '../validation';
import {PageableData} from './pageable';

export type ResponseOK = 'R-00000';
export type ResponseValidationFailures = 'R-00001';
export type ResponseSuccess = ResponseOK | ResponseValidationFailures;
export type ResponseError = 'R-99999';
export type ResponseCode = ResponseSuccess | ResponseError;

export interface InteractionResponse {
	code: ResponseCode;
}

export interface SuccessInteractionResponse<Data> extends InteractionResponse {
	code: ResponseSuccess;
	data?: Data;
}

export interface ErrorInteractionResponse<Details> extends InteractionResponse {
	code: ResponseError;
	/** could be nothing */
	message?: string;
	/** detail error information, could be anything, depends on api itself */
	details?: Details;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PageableResponse<Data> extends SuccessInteractionResponse<PageableData<Data>> {
	code: ResponseOK;
}

export interface ValidationFailedResponse extends SuccessInteractionResponse<Array<ValidateItem>> {
	code: ResponseValidationFailures;
}