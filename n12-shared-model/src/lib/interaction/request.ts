// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InteractionRequest {
}

export interface PageableRequest extends InteractionRequest {
	pageSize?: number;
	pageNumber?: number;
}
