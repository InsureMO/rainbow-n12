import {ValueOperator} from '@rainbow-n19/n1';
import {ConditionCheckFunc, GetInFragmentFromRequestFunc, PerformFunc} from '@rainbow-o23/n3';
import {SetOutFragmentToResponseFunc} from '@rainbow-o23/n3/src/lib/step/abstract-fragmentary-pipeline-step';
import {
	ConditionalPipelineStepSetsBuilderOptions,
	DefaultSteps,
	FragmentaryPipelineStepBuilderOptions,
	PipelineStepBuilderOptions,
	PipelineStepDef,
	PipelineStepSetsBuilderOptions,
	PipelineStepSetsDef,
	SnippetPipelineStepBuilderOptions,
	TypeOrmBySQLPipelineStepBuilderOptions,
	TypeOrmPipelineStepBuilderOptions
} from '@rainbow-o23/n4';
import {Functionalize, Step} from '../types';
import {asT} from './functions';
import {asStep} from './pipeline-def';

export type BuiltStepDef = PipelineStepDef | PipelineStepSetsDef;
export type BuiltStep = BuiltStepDef | StepBuilderEndable;

export abstract class StepBuilder<O extends PipelineStepBuilderOptions> {
	protected constructor(protected readonly def: Partial<PipelineStepDef>) {
	}

	protected get options(): O {
		return asT<O>(this.def);
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

export abstract class StepBuilderEndable<O extends PipelineStepBuilderOptions = PipelineStepBuilderOptions> extends StepBuilder<O> {
	/**
	 * default do nothing. throw error when step def is not valid.
	 */
	protected validate(): void | never {
	}

	public end(): Step<O> {
		ValueOperator.of(this.def.type).isBlank().success(() => {
			this.def.type = 'step';
		});
		this.validate();
		return asStep(asT<Step<O>>(this.def));
	}
}

class StepBuilderMergeOutput<O extends FragmentaryPipelineStepBuilderOptions> extends StepBuilderEndable<O> {
	public mergeAsProperty(name: string): StepBuilderEndable<O> {
		this.options.merge = name;
		return this;
	}

	public destructureMerge(): StepBuilderEndable<O> {
		this.options.merge = true;
		return this;
	}

	public replaceMerge(): StepBuilderEndable<O> {
		this.options.merge = true;
		return this;
	}
}

class StepBuilderConvertOutput<O extends FragmentaryPipelineStepBuilderOptions> extends StepBuilderMergeOutput<O> {
	public outputConvertBy<In, Out, OutFragment>(func: SetOutFragmentToResponseFunc<In, Out, OutFragment>): StepBuilderMergeOutput<O> {
		this.options.toOutput = func;
		return this;
	}
}

class StepBuilderErrorHandling<O extends FragmentaryPipelineStepBuilderOptions> extends StepBuilderConvertOutput<O> {
	protected get errorHandles(): O['errorHandles'] {
		if (this.options.errorHandles == null) {
			this.options.errorHandles = {};
		}
		return this.options.errorHandles;
	}
}

class StepBuilderCatchAny<O extends FragmentaryPipelineStepBuilderOptions> extends StepBuilderErrorHandling<O> {
	public catchAnyErrorByFunc(func: Functionalize<O['errorHandles']['any']>): StepBuilderConvertOutput<O> {
		this.errorHandles.any = func;
		return this;
	}

	public catchAnyErrorBySteps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderConvertOutput<O> {
		this.errorHandles.any = this.buildSteps(step1, ...steps);
		return this;
	}
}

class StepBuilderCatchUncatchable<O extends FragmentaryPipelineStepBuilderOptions> extends StepBuilderCatchAny<O> {
	public catchUncatchableErrorBy(func: Functionalize<O['errorHandles']['uncatchable']>): StepBuilderCatchAny<O> {
		this.errorHandles.uncatchable = func;
		return this;
	}

	public catchUncatchableErrorBySteps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchAny<O> {
		this.errorHandles.uncatchable = this.buildSteps(step1, ...steps);
		return this;
	}
}

class StepBuilderCatchExposed<O extends FragmentaryPipelineStepBuilderOptions> extends StepBuilderCatchUncatchable<O> {
	public catchExposedErrorBy(func: Functionalize<O['errorHandles']['exposed']>): StepBuilderCatchUncatchable<O> {
		this.errorHandles.exposed = func;
		return this;
	}

	public catchExposedErrorBySteps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchUncatchable<O> {
		this.errorHandles.exposed = this.buildSteps(step1, ...steps);
		return this;
	}
}

class StepBuilderCatchCatchable<O extends FragmentaryPipelineStepBuilderOptions> extends StepBuilderCatchExposed<O> {
	public catchCatchableErrorBy(func: Functionalize<O['errorHandles']['catchable']>): StepBuilderCatchExposed<O> {
		this.errorHandles.catchable = func;
		return this;
	}

	public catchCatchableErrorBySteps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchExposed<O> {
		this.errorHandles.catchable = this.buildSteps(step1, ...steps);
		return this;
	}
}

abstract class StepBuilderConvertInput<O extends FragmentaryPipelineStepBuilderOptions, In> extends StepBuilder<O> {
	public inputConvertBy<InFragment = In>(func: GetInFragmentFromRequestFunc<In, InFragment>): Omit<this, 'inputConvertBy'> {
		this.options.fromInput = func;
		return this;
	}
}

// basic
export class SnippetStepBuilder<In, Out> extends StepBuilderConvertInput<SnippetPipelineStepBuilderOptions, In> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.SNIPPET});
	}

	public execute<InFragment = In, OutFragment = Out>(func: PerformFunc<In, InFragment, OutFragment>): StepBuilderCatchCatchable<SnippetPipelineStepBuilderOptions> {
		this.options.snippet = func;
		return new StepBuilderCatchCatchable<SnippetPipelineStepBuilderOptions>(this.def);
	}
}

// sets
export class SetsStepBuilder<In, Out> extends StepBuilderConvertInput<PipelineStepSetsBuilderOptions, In> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.SETS});
	}

	public steps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchCatchable<SnippetPipelineStepBuilderOptions> {
		this.options.steps = this.buildSteps(step1, ...steps);
		return new StepBuilderCatchCatchable<SnippetPipelineStepBuilderOptions>(this.def);
	}
}

class ConditionalStepOtherwiseBuilder<In> extends StepBuilderEndable<ConditionalPipelineStepSetsBuilderOptions> {
	public otherwise(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchCatchable<ConditionalPipelineStepSetsBuilderOptions> {
		this.options.otherwise = this.buildSteps(step1, ...steps);
		return new StepBuilderCatchCatchable<ConditionalPipelineStepSetsBuilderOptions>(this.def);
	}
}

class ConditionalStepThenableBuilder<In> extends StepBuilder<ConditionalPipelineStepSetsBuilderOptions> {
	public then(step1: BuiltStep, ...steps: Array<BuiltStep>): ConditionalStepOtherwiseBuilder<In> {
		this.options.steps = this.buildSteps(step1, ...steps);
		return new ConditionalStepOtherwiseBuilder(this.def);
	}
}

export class ConditionalStepBuilder<In, Out> extends StepBuilderConvertInput<ConditionalPipelineStepSetsBuilderOptions, In> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.CONDITIONAL_SETS});
	}

	public testBy<InFragment = In>(func: ConditionCheckFunc<In, InFragment>): ConditionalStepThenableBuilder<In> {
		this.options.check = func;
		return new ConditionalStepThenableBuilder(this.def);
	}
}

// typeorm
class TypeOrmBySQLStepBuilder<O extends TypeOrmBySQLPipelineStepBuilderOptions> extends StepBuilderEndable<O> {
	public ignoreStaticSql(): StepBuilderCatchCatchable<O> {
		this.options.sql = '@ignore';
		return new StepBuilderCatchCatchable<O>(this.def);
	}

	public sql(sql: string): StepBuilderCatchCatchable<O> {
		this.options.sql = sql;
		return new StepBuilderCatchCatchable<O>(this.def);
	}
}

abstract class TypeOrmTransactionStepBuilder<O extends TypeOrmPipelineStepBuilderOptions, NextBuilder extends StepBuilder<O>> extends StepBuilder<O> {
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

abstract class TypeOrmDataSourceStepBuilder<O extends TypeOrmPipelineStepBuilderOptions, In, NextBuilder extends StepBuilder<O>> extends StepBuilderConvertInput<O, In> {
	public datasource(name: string): NextBuilder {
		this.options.datasource = name;
		return this.createNextBuilder();
	}

	protected abstract createNextBuilder(): NextBuilder;
}

class TypeOrmTransactionAndSqlStepBuilder extends TypeOrmTransactionStepBuilder<TypeOrmBySQLPipelineStepBuilderOptions, TypeOrmBySQLStepBuilder<TypeOrmBySQLPipelineStepBuilderOptions>> {
	protected createNextBuilder(): TypeOrmBySQLStepBuilder<TypeOrmBySQLPipelineStepBuilderOptions> {
		return new TypeOrmBySQLStepBuilder(this.def);
	}
}

export class TypeOrmLoadOneBySQLStepBuilder<In, Out> extends TypeOrmDataSourceStepBuilder<TypeOrmBySQLPipelineStepBuilderOptions, In, TypeOrmTransactionAndSqlStepBuilder> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.TYPEORM_LOAD_ONE_BY_SQL});
	}

	protected createNextBuilder(): TypeOrmTransactionAndSqlStepBuilder {
		return new TypeOrmTransactionAndSqlStepBuilder(this.def);
	}
}

export class TypeOrmLoadManyBySQLStepBuilder<In, Out> extends TypeOrmDataSourceStepBuilder<TypeOrmBySQLPipelineStepBuilderOptions, In, TypeOrmTransactionAndSqlStepBuilder> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.TYPEORM_LOAD_MANY_BY_SQL});
	}

	protected createNextBuilder(): TypeOrmTransactionAndSqlStepBuilder {
		return new TypeOrmTransactionAndSqlStepBuilder(this.def);
	}
}
