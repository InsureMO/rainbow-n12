import {DefaultSteps, TypeOrmTransactionalPipelineStepSetsBuilderOptions} from '@rainbow-o23/n4';
import {BuiltStep, StepBuilder} from './common';
import {StepBuilderCatchCatchable} from './fragmentary';
import {TypeOrmStepDataSourceBuilder} from './typeorm';

export class TypeOrmTransactionalStepOtherwiseBuilder<I, O> extends StepBuilder<TypeOrmTransactionalPipelineStepSetsBuilderOptions, I, O> {
	public steps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchCatchable<TypeOrmTransactionalPipelineStepSetsBuilderOptions, I, O> {
		this.options.steps = this.buildSteps(step1, ...steps);
		return new StepBuilderCatchCatchable<TypeOrmTransactionalPipelineStepSetsBuilderOptions, I, O>(this.def);
	}
}

export class TypeOrmTransactionalStepTransactionBuilder<I, O> extends StepBuilder<TypeOrmTransactionalPipelineStepSetsBuilderOptions, I, O> {
	public transaction(name: string): TypeOrmTransactionalStepOtherwiseBuilder<I, O> {
		this.options.transaction = name;
		return new TypeOrmTransactionalStepOtherwiseBuilder<I, O>(this.def);
	}
}

export class TypeormTransactionalStepBuilder<I, O> extends TypeOrmStepDataSourceBuilder<TypeOrmTransactionalPipelineStepSetsBuilderOptions, I, O, TypeOrmTransactionalStepTransactionBuilder<I, O>> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.TYPEORM_TRANSACTIONAL});
	}

	protected createNextBuilder(): TypeOrmTransactionalStepTransactionBuilder<I, O> {
		return new TypeOrmTransactionalStepTransactionBuilder<I, O>(this.def);
	}
}
