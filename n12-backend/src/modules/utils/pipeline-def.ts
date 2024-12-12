import {GetInFragmentFromRequestFunc, SetOutFragmentToResponseFunc} from '@rainbow-o23/n3';
import {ExposedPipelineDef, PipelineStepBuilderOptions} from '@rainbow-o23/n4';
import {RestApiMeta, ServiceApiMeta, Step} from '../types';
import {asT} from './functions';
import {
	ConditionalStepBuilder,
	SetsStepBuilder,
	SnippetStepBuilder,
	TypeOrmLoadManyBySQLStepBuilder,
	TypeOrmLoadOneBySQLStepBuilder
} from './pipeline-step-builder';

export const asRestApi = (code: string, route: string, method: ExposedPipelineDef['method']): Readonly<RestApiMeta> => {
	const def: RestApiMeta = {name: code, code, route, method, type: 'pipeline'};
	if (method !== 'get') {
		def.body = true;
	}
	return def;
};
export const asServiceApi = (code: string): Readonly<ServiceApiMeta> => {
	return {name: code, code, type: 'pipeline'};
};
/** create given step def to be of type Step */
export const asStep = <O extends PipelineStepBuilderOptions>(def: Omit<Step<O>, 'type'>): Step<O> => {
	const step = asT<Step<O>>(def);
	step.type = 'step';
	return step;
};

export const Steps = {
	snippet: <In, Out>(name: string) => new SnippetStepBuilder<In, Out>(name),
	sets: <In, Out>(name: string) => new SetsStepBuilder<In, Out>(name),
	conditional: <In, Out>(name: string) => new ConditionalStepBuilder<In, Out>(name),
	loadOneBySQL: <In, Out>(name: string) => new TypeOrmLoadOneBySQLStepBuilder<In, Out>(name),
	loadManyBySQL: <In, Out>(name: string) => new TypeOrmLoadManyBySQLStepBuilder<In, Out>(name)
};
export const buildToOutput = <In extends any, Out extends any, OutFragment extends any>(func: SetOutFragmentToResponseFunc<In, Out, OutFragment>): SetOutFragmentToResponseFunc<In, Out, OutFragment> => func;
