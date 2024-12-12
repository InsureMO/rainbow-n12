import {DefaultSteps, PipelineStepSetsBuilderOptions, SnippetPipelineStepBuilderOptions} from '@rainbow-o23/n4';
import {BuiltStep} from './common';
import {StepBuilderCatchCatchable, StepBuilderConvertInput} from './fragmentary';

export class SetsStepBuilder<I, O> extends StepBuilderConvertInput<PipelineStepSetsBuilderOptions, I, O> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.SETS});
	}

	public steps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchCatchable<SnippetPipelineStepBuilderOptions, I, O> {
		this.options.steps = this.buildSteps(step1, ...steps);
		return new StepBuilderCatchCatchable<SnippetPipelineStepBuilderOptions, I, O>(this.def);
	}
}
