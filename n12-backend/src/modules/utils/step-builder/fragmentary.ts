import {
	GetInFragmentFromRequestFunc,
	HandleAnyError,
	HandleCatchableError,
	HandleExposedUncatchableError,
	HandleUncatchableError,
	SetOutFragmentToResponseFunc
} from '@rainbow-o23/n3';
import {FragmentaryPipelineStepBuilderOptions} from '@rainbow-o23/n4';
import {BuiltStep, StepBuilder, StepBuilderEndable} from './common';

export class StepBuilderMergeOutput<Opts extends FragmentaryPipelineStepBuilderOptions, I, O> extends StepBuilderEndable<Opts, I, O> {
	public mergeAsProperty(name: string): StepBuilderEndable<Opts, I, O> {
		this.options.merge = name;
		return this;
	}

	public destructureMerge(): StepBuilderEndable<Opts, I, O> {
		this.options.merge = true;
		return this;
	}

	public replaceMerge(): StepBuilderEndable<Opts, I, O> {
		this.options.merge = true;
		return this;
	}
}

export class StepBuilderConvertOutput<Opts extends FragmentaryPipelineStepBuilderOptions, I, O> extends StepBuilderMergeOutput<Opts, I, O> {
	public outputConvertBy<OFrg = O>(func: SetOutFragmentToResponseFunc<I, O, OFrg>): StepBuilderMergeOutput<Opts, I, O> {
		this.options.toOutput = func;
		return this;
	}
}

export class StepBuilderErrorHandling<Opts extends FragmentaryPipelineStepBuilderOptions, I, O> extends StepBuilderConvertOutput<Opts, I, O> {
	protected get errorHandles(): Opts['errorHandles'] {
		if (this.options.errorHandles == null) {
			this.options.errorHandles = {};
		}
		return this.options.errorHandles;
	}
}

export class StepBuilderCatchAny<Opts extends FragmentaryPipelineStepBuilderOptions, I, O> extends StepBuilderErrorHandling<Opts, I, O> {
	public catchAnyErrorByFunc<IFrg = I, OFrg = O>(func: HandleAnyError<I, IFrg, OFrg>): StepBuilderConvertOutput<Opts, I, O> {
		this.errorHandles.any = func;
		return this;
	}

	public catchAnyErrorBySteps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderConvertOutput<Opts, I, O> {
		this.errorHandles.any = this.buildSteps(step1, ...steps);
		return this;
	}
}

export class StepBuilderCatchUncatchable<Opts extends FragmentaryPipelineStepBuilderOptions, I, O> extends StepBuilderCatchAny<Opts, I, O> {
	public catchUncatchableErrorBy<IFrg = I, OFrg = O>(func: HandleUncatchableError<I, IFrg, OFrg>): StepBuilderCatchAny<Opts, I, O> {
		this.errorHandles.uncatchable = func;
		return this;
	}

	public catchUncatchableErrorBySteps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchAny<Opts, I, O> {
		this.errorHandles.uncatchable = this.buildSteps(step1, ...steps);
		return this;
	}
}

export class StepBuilderCatchExposed<Opts extends FragmentaryPipelineStepBuilderOptions, I, O> extends StepBuilderCatchUncatchable<Opts, I, O> {
	public catchExposedErrorBy<IFrg = I, OFrg = O>(func: HandleExposedUncatchableError<I, IFrg, OFrg>): StepBuilderCatchUncatchable<Opts, I, O> {
		this.errorHandles.exposed = func;
		return this;
	}

	public catchExposedErrorBySteps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchUncatchable<Opts, I, O> {
		this.errorHandles.exposed = this.buildSteps(step1, ...steps);
		return this;
	}
}

export class StepBuilderCatchCatchable<Opts extends FragmentaryPipelineStepBuilderOptions, I, O> extends StepBuilderCatchExposed<Opts, I, O> {
	public catchCatchableErrorBy<IFrg = I, OFrg = O>(func: HandleCatchableError<I, IFrg, OFrg>): StepBuilderCatchExposed<Opts, I, O> {
		this.errorHandles.catchable = func;
		return this;
	}

	public catchCatchableErrorBySteps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchExposed<Opts, I, O> {
		this.errorHandles.catchable = this.buildSteps(step1, ...steps);
		return this;
	}
}

export abstract class StepBuilderConvertInput<Opts extends FragmentaryPipelineStepBuilderOptions, I, O> extends StepBuilder<Opts, I, O> {
	public inputConvertBy<IFrg = I>(func: GetInFragmentFromRequestFunc<I, IFrg>): Omit<this, 'inputConvertBy'> {
		this.options.fromInput = func;
		return this;
	}
}
