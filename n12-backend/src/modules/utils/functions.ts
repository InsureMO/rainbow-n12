import {PipelineStepData} from '@rainbow-o23/n1';
import {PerformFunc} from '@rainbow-o23/n3';
import {
	DefaultSteps,
	ExposedPipelineDef,
	PipelineStepBuilderOptions,
	SnippetPipelineStepBuilderOptions
} from '@rainbow-o23/n4';
import {APIDefMeta, Step} from '../types';

export const apiDefMeta = (code: string, route: string, method: ExposedPipelineDef['method']): Readonly<APIDefMeta> => {
	const def: APIDefMeta = {name: code, code, route, method, type: 'pipeline'};
	if (method !== 'get') {
		def.body = true;
	}
	return def;
};
export const asT = <T>(value: any): T => value;
export const func = <F extends Function>(func: F): F => func;
export const snippet = <In extends any, Out extends any>(func: PerformFunc<PipelineStepData<In>, In, Out>): PerformFunc<PipelineStepData<In>, In, Out> => func;

export const asStep = <O extends PipelineStepBuilderOptions>(def: Omit<Step<O>, 'type'>): Step<O> => {
	const step = asT<Step<O>>(def);
	step.type = 'step';
	return step;
};

export const useSnippet = (name: string, def: Omit<SnippetPipelineStepBuilderOptions, 'name' | 'use' | 'step'>): Step<SnippetPipelineStepBuilderOptions> => {
	const step = asT<Step<SnippetPipelineStepBuilderOptions>>(def);
	step.name = name;
	step.use = DefaultSteps.SNIPPET;
	return asStep(step);
};
