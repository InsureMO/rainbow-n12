import {ScriptFuncOrBody, TypeOrmSql} from '@rainbow-o23/n3';
import {
	DefEnablement,
	ExposedPipelineDef,
	PipelineDef,
	PipelineStepBuilderOptions,
	PipelineStepDef,
	PipelineStepSetsDef
} from '@rainbow-o23/n4';

export interface DefMeta {
	name: string;
	code: string;
}

export interface RestApiMeta extends DefMeta {
	type: 'pipeline';
	route: string;
	method: ExposedPipelineDef['method'];
	body?: ExposedPipelineDef['body'];
}

export interface ServiceApiMeta extends DefMeta {
	type: 'pipeline';
}

export interface ServiceFunctionMeta extends DefMeta {
	type: 'step';
}

export type RestAPI = ExposedPipelineDef & DefEnablement;
export type ServiceAPI = PipelineDef & DefEnablement;
export type ServiceFunction = (PipelineStepDef | PipelineStepSetsDef) & DefEnablement;

// steps
type PickNotFuncBody<T> = {
	[P in keyof T as T[P] extends ScriptFuncOrBody ? never : P]: T[P];
}
type PickFuncBody<T> = {
	[P in keyof T as T[P] extends ScriptFuncOrBody ? P : never]: T[P] extends ScriptFuncOrBody<infer F> ? F : never;
}
export type Step<O extends PipelineStepBuilderOptions> = PipelineStepDef & PickNotFuncBody<O> & PickFuncBody<O>;

// typeorm
export interface TypeOrmPageable {
	offset: number;
	size: number;
}

export type TypeOrmQueryCriteria<Params extends {} = {}> = { params: Params };
export type TypeOrmWithSQL<T> = T & { sql: TypeOrmSql };