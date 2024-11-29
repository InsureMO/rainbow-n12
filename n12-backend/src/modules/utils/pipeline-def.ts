import {PipelineStepData} from '@rainbow-o23/n1';
import {GetInFragmentFromRequestFunc, PerformFunc, SetOutFragmentToResponseFunc} from '@rainbow-o23/n3';
import {ConditionCheckFunc} from '@rainbow-o23/n3/src/lib/step/conditional-step-sets';
import {
	ConditionalPipelineStepSetsBuilderOptions,
	DefaultSteps,
	ExposedPipelineDef,
	PipelineStepBuilderOptions,
	SnippetPipelineStepBuilderOptions,
	TypeOrmBySQLPipelineStepBuilderOptions
} from '@rainbow-o23/n4';
import {PipelineStepSetsBuilderOptions} from '@rainbow-o23/n4/src/lib/step-builder/basic/step-sets-builder';
import {RestApiMeta, ServiceApiMeta, Step} from '../types';
import {asT} from './functions';

export const asServiceApi = (code: string): Readonly<ServiceApiMeta> => {
	return {name: code, code, type: 'pipeline'};
};
export const asRestApi = (code: string, route: string, method: ExposedPipelineDef['method']): Readonly<RestApiMeta> => {
	const def: RestApiMeta = {name: code, code, route, method, type: 'pipeline'};
	if (method !== 'get') {
		def.body = true;
	}
	return def;
};
/** create given step def to be of type Step */
export const asStep = <O extends PipelineStepBuilderOptions>(def: Omit<Step<O>, 'type'>): Step<O> => {
	const step = asT<Step<O>>(def);
	step.type = 'step';
	return step;
};
const useStep = <O extends PipelineStepBuilderOptions>(name: string, use: DefaultSteps, def: Omit<O, 'name' | 'use'>): Step<O> => {
	const step = asT<Step<O>>(def);
	step.name = name;
	step.use = use;
	return asStep(step);
};
const useSnippet = (name: string, def: Omit<SnippetPipelineStepBuilderOptions, 'name' | 'use'>): Step<SnippetPipelineStepBuilderOptions> => {
	return useStep<SnippetPipelineStepBuilderOptions>(name, DefaultSteps.SNIPPET, def);
};
const useSets = (name: string, def: Omit<PipelineStepSetsBuilderOptions, 'name' | 'use'>): Step<PipelineStepSetsBuilderOptions> => {
	return useStep<PipelineStepSetsBuilderOptions>(name, DefaultSteps.SETS, def);
};
const useConditional = (name: string, def: Omit<ConditionalPipelineStepSetsBuilderOptions, 'name' | 'use'>): Step<ConditionalPipelineStepSetsBuilderOptions> => {
	return useStep<ConditionalPipelineStepSetsBuilderOptions>(name, DefaultSteps.CONDITIONAL_SETS, def);
};
const useTypeOrmLoadBySQL = (name: string, def: Omit<TypeOrmBySQLPipelineStepBuilderOptions, 'name' | 'use'>): Step<TypeOrmBySQLPipelineStepBuilderOptions> => {
	return useStep<TypeOrmBySQLPipelineStepBuilderOptions>(name, DefaultSteps.TYPEORM_LOAD_MANY_BY_SQL, def);
};
export const Steps = {
	snippet: useSnippet,
	sets: useSets,
	conditional: useConditional,
	loadBySQL: useTypeOrmLoadBySQL
};
export const buildFromInput = <In extends any, InFragment extends any>(func: GetInFragmentFromRequestFunc<In, InFragment>): GetInFragmentFromRequestFunc<In, InFragment> => func;
export const buildToOutput = <In extends any, Out extends any, OutFragment extends any>(func: SetOutFragmentToResponseFunc<In, Out, OutFragment>): SetOutFragmentToResponseFunc<In, Out, OutFragment> => func;
export const buildSnippet = <In extends any, Out extends any>(func: PerformFunc<PipelineStepData<In>, In, Out>): PerformFunc<PipelineStepData<In>, In, Out> => func;
export const buildConditionalCheck = <In extends any>(func: ConditionCheckFunc<PipelineStepData<In>, In>): ConditionCheckFunc<PipelineStepData<In>, In> => func;
