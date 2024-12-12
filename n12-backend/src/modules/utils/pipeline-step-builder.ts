import {ValueOperator} from '@rainbow-n19/n1';
import {
	ConditionCheckFunc,
	GetInFragmentFromRequestFunc,
	HandleAnyError,
	HandleCatchableError,
	HandleExposedUncatchableError,
	HandleUncatchableError,
	PerformFunc,
	SetOutFragmentToResponseFunc
} from '@rainbow-o23/n3';
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
import {Step} from '../types';
import {asT} from './functions';
import {asStep} from './pipeline-def';

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

class StepBuilderMergeOutput<Opts extends FragmentaryPipelineStepBuilderOptions, I, O> extends StepBuilderEndable<Opts, I, O> {
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

class StepBuilderConvertOutput<Opts extends FragmentaryPipelineStepBuilderOptions, I, O> extends StepBuilderMergeOutput<Opts, I, O> {
	public outputConvertBy<OFrg = O>(func: SetOutFragmentToResponseFunc<I, O, OFrg>): StepBuilderMergeOutput<Opts, I, O> {
		this.options.toOutput = func;
		return this;
	}
}

class StepBuilderErrorHandling<Opts extends FragmentaryPipelineStepBuilderOptions, I, O> extends StepBuilderConvertOutput<Opts, I, O> {
	protected get errorHandles(): Opts['errorHandles'] {
		if (this.options.errorHandles == null) {
			this.options.errorHandles = {};
		}
		return this.options.errorHandles;
	}
}

class StepBuilderCatchAny<Opts extends FragmentaryPipelineStepBuilderOptions, I, O> extends StepBuilderErrorHandling<Opts, I, O> {
	public catchAnyErrorByFunc<IFrg = I, OFrg = O>(func: HandleAnyError<I, IFrg, OFrg>): StepBuilderConvertOutput<Opts, I, O> {
		this.errorHandles.any = func;
		return this;
	}

	public catchAnyErrorBySteps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderConvertOutput<Opts, I, O> {
		this.errorHandles.any = this.buildSteps(step1, ...steps);
		return this;
	}
}

class StepBuilderCatchUncatchable<Opts extends FragmentaryPipelineStepBuilderOptions, I, O> extends StepBuilderCatchAny<Opts, I, O> {
	public catchUncatchableErrorBy<IFrg = I, OFrg = O>(func: HandleUncatchableError<I, IFrg, OFrg>): StepBuilderCatchAny<Opts, I, O> {
		this.errorHandles.uncatchable = func;
		return this;
	}

	public catchUncatchableErrorBySteps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchAny<Opts, I, O> {
		this.errorHandles.uncatchable = this.buildSteps(step1, ...steps);
		return this;
	}
}

class StepBuilderCatchExposed<Opts extends FragmentaryPipelineStepBuilderOptions, I, O> extends StepBuilderCatchUncatchable<Opts, I, O> {
	public catchExposedErrorBy<IFrg = I, OFrg = O>(func: HandleExposedUncatchableError<I, IFrg, OFrg>): StepBuilderCatchUncatchable<Opts, I, O> {
		this.errorHandles.exposed = func;
		return this;
	}

	public catchExposedErrorBySteps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchUncatchable<Opts, I, O> {
		this.errorHandles.exposed = this.buildSteps(step1, ...steps);
		return this;
	}
}

class StepBuilderCatchCatchable<Opts extends FragmentaryPipelineStepBuilderOptions, I, O> extends StepBuilderCatchExposed<Opts, I, O> {
	public catchCatchableErrorBy<IFrg = I, OFrg = O>(func: HandleCatchableError<I, IFrg, OFrg>): StepBuilderCatchExposed<Opts, I, O> {
		this.errorHandles.catchable = func;
		return this;
	}

	public catchCatchableErrorBySteps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchExposed<Opts, I, O> {
		this.errorHandles.catchable = this.buildSteps(step1, ...steps);
		return this;
	}
}

abstract class StepBuilderConvertInput<Opts extends FragmentaryPipelineStepBuilderOptions, I, O> extends StepBuilder<Opts, I, O> {
	public inputConvertBy<IFrg = I>(func: GetInFragmentFromRequestFunc<I, IFrg>): Omit<this, 'inputConvertBy'> {
		this.options.fromInput = func;
		return this;
	}
}

// basic
export class SnippetStepBuilder<I, O> extends StepBuilderConvertInput<SnippetPipelineStepBuilderOptions, I, O> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.SNIPPET});
	}

	public execute<IFrg = I, OFrg = O>(func: PerformFunc<I, IFrg, OFrg>): StepBuilderCatchCatchable<SnippetPipelineStepBuilderOptions, I, O> {
		this.options.snippet = func;
		return new StepBuilderCatchCatchable<SnippetPipelineStepBuilderOptions, I, O>(this.def);
	}
}

// sets
export class SetsStepBuilder<I, O> extends StepBuilderConvertInput<PipelineStepSetsBuilderOptions, I, O> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.SETS});
	}

	public steps(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchCatchable<SnippetPipelineStepBuilderOptions, I, O> {
		this.options.steps = this.buildSteps(step1, ...steps);
		return new StepBuilderCatchCatchable<SnippetPipelineStepBuilderOptions, I, O>(this.def);
	}
}

class ConditionalStepOtherwiseBuilder<I, O> extends StepBuilderEndable<ConditionalPipelineStepSetsBuilderOptions, I, O> {
	public otherwise(step1: BuiltStep, ...steps: Array<BuiltStep>): StepBuilderCatchCatchable<ConditionalPipelineStepSetsBuilderOptions, I, O> {
		this.options.otherwise = this.buildSteps(step1, ...steps);
		return new StepBuilderCatchCatchable<ConditionalPipelineStepSetsBuilderOptions, I, O>(this.def);
	}
}

class ConditionalStepThenableBuilder<I, O> extends StepBuilder<ConditionalPipelineStepSetsBuilderOptions, I, O> {
	public then(step1: BuiltStep, ...steps: Array<BuiltStep>): ConditionalStepOtherwiseBuilder<I, O> {
		this.options.steps = this.buildSteps(step1, ...steps);
		return new ConditionalStepOtherwiseBuilder(this.def);
	}
}

export class ConditionalStepBuilder<I, O> extends StepBuilderConvertInput<ConditionalPipelineStepSetsBuilderOptions, I, O> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.CONDITIONAL_SETS});
	}

	public testBy<InFragment = I>(func: ConditionCheckFunc<I, InFragment>): ConditionalStepThenableBuilder<I, O> {
		this.options.check = func;
		return new ConditionalStepThenableBuilder(this.def);
	}
}

// typeorm
class TypeOrmBySQLStepBuilder<Opts extends TypeOrmBySQLPipelineStepBuilderOptions, I, O> extends StepBuilderEndable<Opts, I, O> {
	public ignoreStaticSql(): StepBuilderCatchCatchable<Opts, I, O> {
		this.options.sql = '@ignore';
		return new StepBuilderCatchCatchable<Opts, I, O>(this.def);
	}

	public sql(sql: string): StepBuilderCatchCatchable<Opts, I, O> {
		this.options.sql = sql;
		return new StepBuilderCatchCatchable<Opts, I, O>(this.def);
	}
}

abstract class TypeOrmTransactionStepBuilder<Opts extends TypeOrmPipelineStepBuilderOptions, I, O, NextBuilder extends StepBuilder<Opts, I, O>> extends StepBuilder<Opts, I, O> {
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

abstract class TypeOrmDataSourceStepBuilder<Opts extends TypeOrmPipelineStepBuilderOptions, I, O, NextBuilder extends StepBuilder<Opts, I, O>> extends StepBuilderConvertInput<Opts, I, O> {
	public datasource(name: string): NextBuilder {
		this.options.datasource = name;
		return this.createNextBuilder();
	}

	protected abstract createNextBuilder(): NextBuilder;
}

class TypeOrmTransactionAndSqlStepBuilder<I, O> extends TypeOrmTransactionStepBuilder<TypeOrmBySQLPipelineStepBuilderOptions, I, O, TypeOrmBySQLStepBuilder<TypeOrmBySQLPipelineStepBuilderOptions, I, O>> {
	protected createNextBuilder(): TypeOrmBySQLStepBuilder<TypeOrmBySQLPipelineStepBuilderOptions, I, O> {
		return new TypeOrmBySQLStepBuilder(this.def);
	}
}

export class TypeOrmLoadOneBySQLStepBuilder<I, O> extends TypeOrmDataSourceStepBuilder<TypeOrmBySQLPipelineStepBuilderOptions, I, O, TypeOrmTransactionAndSqlStepBuilder<I, O>> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.TYPEORM_LOAD_ONE_BY_SQL});
	}

	protected createNextBuilder(): TypeOrmTransactionAndSqlStepBuilder<I, O> {
		return new TypeOrmTransactionAndSqlStepBuilder(this.def);
	}
}

export class TypeOrmLoadManyBySQLStepBuilder<I, O> extends TypeOrmDataSourceStepBuilder<TypeOrmBySQLPipelineStepBuilderOptions, I, O, TypeOrmTransactionAndSqlStepBuilder<I, O>> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.TYPEORM_LOAD_MANY_BY_SQL});
	}

	protected createNextBuilder(): TypeOrmTransactionAndSqlStepBuilder<I, O> {
		return new TypeOrmTransactionAndSqlStepBuilder(this.def);
	}
}
