export type ResponseSuccess = 'R-00000';
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