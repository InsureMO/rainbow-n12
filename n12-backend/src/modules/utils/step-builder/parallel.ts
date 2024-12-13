import {CloneDataFunc} from '@rainbow-o23/n3';
import {DefaultSteps, ParallelPipelineStepSetsBuilderOptions} from '@rainbow-o23/n4';
import {BuiltStep, StepBuilder} from './common';
import {StepBuilderCatchCatchable, StepBuilderConvertInput} from './fragmentary';

export class ParallelSetsStepRaceBuilder<I, O> extends StepBuilderCatchCatchable<ParallelPipelineStepSetsBuilderOptions, I, O> {
	public race(): StepBuilderCatchCatchable<ParallelPipelineStepSetsBuilderOptions, I, O> {
		this.options.race = true;
		return new StepBuilderCatchCatchable<ParallelPipelineStepSetsBuilderOptions, I, O>(this.def);
	}

	public gatherAll(): StepBuilderCatchCatchable<ParallelPipelineStepSetsBuilderOptions, I, O> {
		delete this.options.race;
		return new StepBuilderCatchCatchable<ParallelPipelineStepSetsBuilderOptions, I, O>(this.def);
	}
}

export class ParallelSetsStepStepsBuilder<I, O> extends StepBuilder<ParallelPipelineStepSetsBuilderOptions, I, O> {
	public steps(step1: BuiltStep, ...steps: Array<BuiltStep>): ParallelSetsStepRaceBuilder<I, O> {
		this.options.steps = this.buildSteps(step1, ...steps);
		return new ParallelSetsStepRaceBuilder<I, O>(this.def);
	}
}

export class ParallelSetsStepBuilder<I, O> extends StepBuilderConvertInput<ParallelPipelineStepSetsBuilderOptions, I, O> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.PARALLEL_SETS});
	}

	public cloneDataBy<Item = I, IFrg = I>(func: CloneDataFunc<I, IFrg, Item>): ParallelSetsStepStepsBuilder<I, O> {
		this.options.cloneData = func;
		return new ParallelSetsStepStepsBuilder<I, O>(this.def);
	}

	/**
	 * share memory for all parallel steps
	 */
	public shareMemoryForAll(): ParallelSetsStepStepsBuilder<I, O> {
		delete this.options.cloneData;
		return new ParallelSetsStepStepsBuilder<I, O>(this.def);
	}
}
