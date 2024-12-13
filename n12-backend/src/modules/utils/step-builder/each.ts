import {DefaultSteps, EachPipelineStepSetsBuilderOptions} from '@rainbow-o23/n4';
import {BuiltStep, StepBuilder} from './common';
import {StepBuilderCatchCatchable, StepBuilderConvertInput} from './fragmentary';

export class EachSetsStepStepsBuilder<I, O> extends StepBuilder<EachPipelineStepSetsBuilderOptions, I, O> {
	public steps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchCatchable<EachPipelineStepSetsBuilderOptions, I, O> {
		this.options.steps = this.buildSteps(step1, ...steps);
		return new StepBuilderCatchCatchable<EachPipelineStepSetsBuilderOptions, I, O>(this.def);
	}
}

export class EachSetsStepItemNameBuilder<I, O> extends StepBuilder<EachPipelineStepSetsBuilderOptions, I, O> {
	public propertyForItem(name: string): EachSetsStepStepsBuilder<I, O> {
		this.options.itemName = name;
		return new EachSetsStepStepsBuilder<I, O>(this.def);
	}

	/**
	 * default name is "$item"
	 */
	public useDefaultPropertyForItem(): EachSetsStepStepsBuilder<I, O> {
		delete this.options.itemName;
		return new EachSetsStepStepsBuilder<I, O>(this.def);
	}
}

export class EachSetsStepBuilder<I, O> extends StepBuilderConvertInput<EachPipelineStepSetsBuilderOptions, I, O> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.EACH_SETS});
	}

	public propertyForOriginContent(name: string): EachSetsStepItemNameBuilder<I, O> {
		this.options.originalContentName = name;
		return new EachSetsStepItemNameBuilder<I, O>(this.def);
	}

	/**
	 * default name is "$content"
	 */
	public useDefaultPropertyForOriginContent(): EachSetsStepItemNameBuilder<I, O> {
		delete this.options.originalContentName;
		return new EachSetsStepItemNameBuilder<I, O>(this.def);
	}
}
