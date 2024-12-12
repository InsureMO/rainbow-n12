import {BuiltStep, StepBuilderEndable} from '../step-builder';
import {IngMeta} from './types';

export abstract class IngMetaBuilder<Meta extends IngMeta> {
	public constructor(protected readonly meta: Meta) {
	}
}

export abstract class AbstractEnablementBuilder<NextBuilder, Meta extends IngMeta> extends IngMetaBuilder<Meta> {
	protected abstract createRequestAndResponseBuilder(): NextBuilder;

	enable(enabled: boolean = true): NextBuilder {
		this.meta.enabled = enabled;
		return this.createRequestAndResponseBuilder();
	}
}

export abstract class AbstractStepsBuilder<Publisher, Meta extends IngMeta> extends IngMetaBuilder<Meta> {
	protected abstract createPublisher(): Publisher;

	steps(step: BuiltStep, ...moreSteps: Array<BuiltStep>): Publisher {
		this.meta.steps = [step, ...moreSteps].map(step => {
			if (step instanceof StepBuilderEndable) {
				return step.end();
			} else {
				return step;
			}
		});
		return this.createPublisher();
	}
}
