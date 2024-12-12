import {TypeOrmBySQLPipelineStepBuilderOptions, TypeOrmPipelineStepBuilderOptions} from '@rainbow-o23/n4';
import {StepBuilder, StepBuilderEndable} from './common';
import {StepBuilderCatchCatchable, StepBuilderConvertInput} from './fragmentary';

export class TypeOrmBySQLStepBuilder<Opts extends TypeOrmBySQLPipelineStepBuilderOptions, I, O> extends StepBuilderEndable<Opts, I, O> {
	public ignoreStaticSql(): StepBuilderCatchCatchable<Opts, I, O> {
		this.options.sql = '@ignore';
		return new StepBuilderCatchCatchable<Opts, I, O>(this.def);
	}

	public sql(sql: string): StepBuilderCatchCatchable<Opts, I, O> {
		this.options.sql = sql;
		return new StepBuilderCatchCatchable<Opts, I, O>(this.def);
	}
}

export abstract class TypeOrmTransactionStepBuilder<Opts extends TypeOrmPipelineStepBuilderOptions, I, O, NextBuilder extends StepBuilder<Opts, I, O>> extends StepBuilder<Opts, I, O> {
	public transaction(name: string): NextBuilder {
		this.options.transaction = name;
		return this.createNextBuilder();
	}

	public autonomousTransaction(): NextBuilder {
		this.options.autonomous = true;
		return this.createNextBuilder();
	}

	protected abstract createNextBuilder(): NextBuilder
}

export abstract class TypeOrmDataSourceStepBuilder<Opts extends TypeOrmPipelineStepBuilderOptions, I, O, NextBuilder extends StepBuilder<Opts, I, O>> extends StepBuilderConvertInput<Opts, I, O> {
	public datasource(name: string): NextBuilder {
		this.options.datasource = name;
		return this.createNextBuilder();
	}

	protected abstract createNextBuilder(): NextBuilder;
}

export class TypeOrmTransactionAndSqlStepBuilder<I, O> extends TypeOrmTransactionStepBuilder<TypeOrmBySQLPipelineStepBuilderOptions, I, O, TypeOrmBySQLStepBuilder<TypeOrmBySQLPipelineStepBuilderOptions, I, O>> {
	protected createNextBuilder(): TypeOrmBySQLStepBuilder<TypeOrmBySQLPipelineStepBuilderOptions, I, O> {
		return new TypeOrmBySQLStepBuilder(this.def);
	}
}
