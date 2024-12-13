import {ConditionCheckFunc} from '@rainbow-o23/n3';
import {ConditionalPipelineStepSetsBuilderOptions, DefaultSteps} from '@rainbow-o23/n4';
import {BuiltStep, StepBuilder} from './common';
import {StepBuilderCatchCatchable, StepBuilderConvertInput} from './fragmentary';

export class ConditionalStepOtherwiseBuilder<I, O> extends StepBuilderCatchCatchable<ConditionalPipelineStepSetsBuilderOptions, I, O> {
	public otherwise(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchCatchable<ConditionalPipelineStepSetsBuilderOptions, I, O> {
		this.options.otherwise = this.buildSteps(step1, ...steps);
		return new StepBuilderCatchCatchable<ConditionalPipelineStepSetsBuilderOptions, I, O>(this.def);
	}
}

export class ConditionalStepThenableBuilder<I, O> extends StepBuilder<ConditionalPipelineStepSetsBuilderOptions, I, O> {
	public then(step1: BuiltStep, ...steps: Array<BuiltStep>): ConditionalStepOtherwiseBuilder<I, O> {
		this.options.steps = this.buildSteps(step1, ...steps);
		return new ConditionalStepOtherwiseBuilder<I, O>(this.def);
	}
}

export class ConditionalStepBuilder<I, O> extends StepBuilderConvertInput<ConditionalPipelineStepSetsBuilderOptions, I, O> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.CONDITIONAL_SETS});
	}

	public testBy<IFrg = I>(func: ConditionCheckFunc<I, IFrg>): ConditionalStepThenableBuilder<I, O> {
		this.options.check = func;
		return new ConditionalStepThenableBuilder<I, O>(this.def);
	}
}
