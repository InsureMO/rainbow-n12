import {StreamToFunc} from '@rainbow-o23/n3';
import {
	DefaultSteps,
	TypeOrmBySQLPipelineStepBuilderOptions,
	TypeOrmLoadManyBySQLUseCursorPipelineStepBuilderOptions
} from '@rainbow-o23/n4';
import {BuiltStep, StepBuilder, StepBuilderEndable} from './common';
import {StepBuilderCatchCatchable} from './fragmentary';
import {TypeOrmStepDataSourceBuilder, TypeOrmStepTransactionBuilder} from './typeorm';

export class TypeLoadManyBySQLUseCursorStepStepsBuilder<I, O> extends StepBuilderEndable<TypeOrmLoadManyBySQLUseCursorPipelineStepBuilderOptions, I, O> {
	public steps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchCatchable<TypeOrmLoadManyBySQLUseCursorPipelineStepBuilderOptions, I, O> {
		this.options.steps = this.buildSteps(step1, ...steps);
		return new StepBuilderCatchCatchable<TypeOrmLoadManyBySQLUseCursorPipelineStepBuilderOptions, I, O>(this.def);
	}
}

export class TypeLoadManyBySQLUseCursorStepStreamToBuilder<I, O> extends StepBuilder<TypeOrmLoadManyBySQLUseCursorPipelineStepBuilderOptions, I, O> {
	public streamTo<Item>(func: StreamToFunc<I, Item>): TypeLoadManyBySQLUseCursorStepStepsBuilder<I, O> {
		this.options.streamTo = func;
		return new TypeLoadManyBySQLUseCursorStepStepsBuilder<I, O>(this.def);
	}

	public useResultSetRows(): TypeLoadManyBySQLUseCursorStepStepsBuilder<I, O> {
		delete this.options.streamTo;
		return new TypeLoadManyBySQLUseCursorStepStepsBuilder<I, O>(this.def);
	}
}

export class TypeOrmLoadManyBySQLUseCursorStepFetchSizeBuilder<I, O> extends StepBuilder<TypeOrmLoadManyBySQLUseCursorPipelineStepBuilderOptions, I, O> {
	public fetchSize(fetchSize: number): TypeLoadManyBySQLUseCursorStepStreamToBuilder<I, O> {
		this.options.fetchSize = fetchSize;
		return new TypeLoadManyBySQLUseCursorStepStreamToBuilder<I, O>(this.def);
	}

	public useDefaultFetchSize(): TypeLoadManyBySQLUseCursorStepStreamToBuilder<I, O> {
		delete this.options.fetchSize;
		return new TypeLoadManyBySQLUseCursorStepStreamToBuilder<I, O>(this.def);
	}
}

export class TypeOrmLoadManyBySQLUseCursorStepSqlBuilder<I, O> extends StepBuilder<TypeOrmLoadManyBySQLUseCursorPipelineStepBuilderOptions, I, O> {
	public ignoreStaticSql(): TypeOrmLoadManyBySQLUseCursorStepFetchSizeBuilder<I, O> {
		this.options.sql = '@ignore';
		return new TypeOrmLoadManyBySQLUseCursorStepFetchSizeBuilder<I, O>(this.def);
	}

	public sql(sql: string): TypeOrmLoadManyBySQLUseCursorStepFetchSizeBuilder<I, O> {
		this.options.sql = sql;
		return new TypeOrmLoadManyBySQLUseCursorStepFetchSizeBuilder<I, O>(this.def);
	}
}

export class TypeOrmLoadManyBySQLUseCursorStepTransactionAndMoreBuilder<I, O> extends TypeOrmStepTransactionBuilder<TypeOrmBySQLPipelineStepBuilderOptions, I, O, TypeOrmLoadManyBySQLUseCursorStepSqlBuilder<I, O>> {
	protected createNextBuilder(): TypeOrmLoadManyBySQLUseCursorStepSqlBuilder<I, O> {
		return new TypeOrmLoadManyBySQLUseCursorStepSqlBuilder<I, O>(this.def);
	}
}

export class TypeOrmLoadManyBySQLUseCursorStepBuilder<I, O> extends TypeOrmStepDataSourceBuilder<TypeOrmLoadManyBySQLUseCursorPipelineStepBuilderOptions, I, O, TypeOrmLoadManyBySQLUseCursorStepTransactionAndMoreBuilder<I, O>> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.TYPEORM_LOAD_MANY_BY_SQL_USE_CURSOR});
	}

	protected createNextBuilder(): TypeOrmLoadManyBySQLUseCursorStepTransactionAndMoreBuilder<I, O> {
		return new TypeOrmLoadManyBySQLUseCursorStepTransactionAndMoreBuilder<I, O>(this.def);
	}
}
