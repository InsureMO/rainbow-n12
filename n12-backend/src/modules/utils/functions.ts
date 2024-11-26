import {PipelineStepData} from '@rainbow-o23/n1';
import {GetInFragmentFromRequestFunc, PerformFunc, SetOutFragmentToResponseFunc} from '@rainbow-o23/n3';
import {
	DefaultSteps,
	ExposedPipelineDef,
	PipelineStepBuilderOptions,
	SnippetPipelineStepBuilderOptions,
	TypeOrmBySQLPipelineStepBuilderOptions
} from '@rainbow-o23/n4';
import {APIDefMeta, Step} from '../types';

export const apiDefMeta = (code: string, route: string, method: ExposedPipelineDef['method']): Readonly<APIDefMeta> => {
	const def: APIDefMeta = {name: code, code, route, method, type: 'pipeline'};
	if (method !== 'get') {
		def.body = true;
	}
	return def;
};
/** assert given value to be of type T */
export const asT = <T>(value: any): T => value;
/** assert given function to be of type F */
export const asF = <F extends Function>(func: F): F => func;
/** create given step def to be of type Step */
export const asStep = <O extends PipelineStepBuilderOptions>(def: Omit<Step<O>, 'type'>): Step<O> => {
	const step = asT<Step<O>>(def);
	step.type = 'step';
	return step;
};

const useSnippet = (name: string, def: Omit<SnippetPipelineStepBuilderOptions, 'name' | 'use' | 'step'>): Step<SnippetPipelineStepBuilderOptions> => {
	const step = asT<Step<SnippetPipelineStepBuilderOptions>>(def);
	step.name = name;
	step.use = DefaultSteps.SNIPPET;
	return asStep(step);
};
const useTypeOrmLoadBySQL = (name: string, def: Omit<TypeOrmBySQLPipelineStepBuilderOptions, 'name' | 'use' | 'step' | 'sql'> & Partial<Pick<TypeOrmBySQLPipelineStepBuilderOptions, 'sql'>>): Step<TypeOrmBySQLPipelineStepBuilderOptions> => {
	const step = asT<Step<TypeOrmBySQLPipelineStepBuilderOptions>>(def);
	step.name = name;
	step.use = DefaultSteps.TYPEORM_LOAD_MANY_BY_SQL;
	return asStep(step);
};

export const Steps = {
	snippet: useSnippet,
	useLoadBySQL: useTypeOrmLoadBySQL
};

export const buildFromInput = <In extends any, InFragment extends any>(func: GetInFragmentFromRequestFunc<In, InFragment>): GetInFragmentFromRequestFunc<In, InFragment> => func;
export const buildToOutput = <In extends any, Out extends any, OutFragment extends any>(func: SetOutFragmentToResponseFunc<In, Out, OutFragment>): SetOutFragmentToResponseFunc<In, Out, OutFragment> => func;
export const buildSnippet = <In extends any, Out extends any>(func: PerformFunc<PipelineStepData<In>, In, Out>): PerformFunc<PipelineStepData<In>, In, Out> => func;
