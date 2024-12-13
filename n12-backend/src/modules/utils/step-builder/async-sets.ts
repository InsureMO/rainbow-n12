import {DefaultSteps, PipelineStepSetsBuilderOptions} from '@rainbow-o23/n4';
import {BuiltStep} from './common';
import {StepBuilderCatchCatchable, StepBuilderConvertInput} from './fragmentary';

export class AsyncSetsStepBuilder<I, O> extends StepBuilderConvertInput<PipelineStepSetsBuilderOptions, I, O> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.ASYNC_SETS});
	}

	public steps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchCatchable<PipelineStepSetsBuilderOptions, I, O> {
		this.options.steps = this.buildSteps(step1, ...steps);
		return new StepBuilderCatchCatchable<PipelineStepSetsBuilderOptions, I, O>(this.def);
	}
}
