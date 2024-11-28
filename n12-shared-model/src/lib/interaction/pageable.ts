export interface Pageable {
	pageSize: number;
	pageNumber: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PageableData<Item = any> extends Pageable {
	items: Array<Item>;
	itemCount: number;
	pageCount: number;
}
