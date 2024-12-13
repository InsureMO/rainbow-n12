import {ConditionCheckFunc} from '@rainbow-o23/n3';
import {DefaultSteps, RoutesPipelineStepSetsBuilderOptions} from '@rainbow-o23/n4';
import {BuiltStep, StepBuilder} from './common';
import {StepBuilderCatchCatchable, StepBuilderConvertInput} from './fragmentary';

export class RoutesStepOtherwiseBuilder<I, O> extends StepBuilderCatchCatchable<RoutesPipelineStepSetsBuilderOptions, I, O> {
	public andTestRouteBy<IFrg = I>(func: ConditionCheckFunc<I, IFrg>): RoutesStepThenableBuilder<I, O> {
		this.options.routes.push({check: func});
		return new RoutesStepThenableBuilder<I, O>(this.def);
	}

	public otherwise(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchCatchable<RoutesPipelineStepSetsBuilderOptions, I, O> {
		this.options.otherwise = this.buildSteps(step1, ...steps);
		return new StepBuilderCatchCatchable<RoutesPipelineStepSetsBuilderOptions, I, O>(this.def);
	}
}

export class RoutesStepThenableBuilder<I, O> extends StepBuilder<RoutesPipelineStepSetsBuilderOptions, I, O> {
	public then(step1: BuiltStep, ...steps: Array<BuiltStep>): RoutesStepOtherwiseBuilder<I, O> {
		this.options.routes[this.options.routes.length - 1].steps = this.buildSteps(step1, ...steps);
		return new RoutesStepOtherwiseBuilder<I, O>(this.def);
	}
}

export class RoutesSetsStepBuilder<I, O> extends StepBuilderConvertInput<RoutesPipelineStepSetsBuilderOptions, I, O> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.ROUTES_SETS});
	}

	public testRouteBy<IFrg = I>(func: ConditionCheckFunc<I, IFrg>): RoutesStepThenableBuilder<I, O> {
		if (this.options.routes == null) {
			this.options.routes = [];
		}
		this.options.routes.push({check: func});
		return new RoutesStepThenableBuilder<I, O>(this.def);
	}
}
