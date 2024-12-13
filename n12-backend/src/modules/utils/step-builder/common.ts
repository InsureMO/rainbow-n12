import {ValueOperator} from '@rainbow-n19/n1';
import {PipelineStepBuilderOptions, PipelineStepDef, PipelineStepSetsDef} from '@rainbow-o23/n4';
import {Step} from '../../types';
import {asT} from '../functions';

/** create given step def to be of type Step */
export const asStep = <O extends PipelineStepBuilderOptions>(def: Omit<Step<O>, 'type'>): Step<O> => {
	const step = asT<Step<O>>(def);
	step.type = 'step';
	return step;
};

export type BuiltStepDef = PipelineStepDef | PipelineStepSetsDef;
export type BuiltStep = BuiltStepDef | StepBuilderEndable<any, any, any>;

export abstract class StepBuilder<Opts extends PipelineStepBuilderOptions, I, O> {
	protected constructor(protected readonly def: Partial<PipelineStepDef>) {
	}

	protected get options(): Opts {
		return asT<Opts>(this.def);
	}

	protected buildSteps(step: BuiltStep, ...steps: Array<BuiltStep>): Array<BuiltStepDef> {
		return [step, ...steps].map(step => {
			if (step instanceof StepBuilderEndable) {
				return step.end();
			} else {
				return step;
			}
		});
	}
}

/**
 * builder extends this means it can be ended directly without any further settings.
 */
export abstract class StepBuilderEndable<Opts extends PipelineStepBuilderOptions, I, O> extends StepBuilder<Opts, I, O> {
	/**
	 * default do nothing. throw error when step def is not valid.
	 */
	protected validate(): void | never {
	}

	public end(): Step<Opts> {
		ValueOperator.of(this.def.type).isBlank().success(() => {
			this.def.type = 'step';
		});
		this.validate();
		return asStep(asT<Step<Opts>>(this.def));
	}
}
