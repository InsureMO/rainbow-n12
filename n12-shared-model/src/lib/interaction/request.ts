import {Pageable} from './pageable';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InteractionRequest {
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PageableRequest extends InteractionRequest, Partial<Pageable> {
}
