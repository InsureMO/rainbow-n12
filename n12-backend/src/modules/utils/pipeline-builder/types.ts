import {RestAPI, ServiceAPI} from '../../types';

export type RestApiIngMeta = Partial<RestAPI>;
export type ServiceApiIngMeta = Partial<ServiceAPI>;
export type IngMeta = RestApiIngMeta | ServiceApiIngMeta;
