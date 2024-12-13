import {TypeOrmPerformFunc} from '@rainbow-o23/n3';
import {DefaultSteps, TypeOrmBySnippetPipelineStepBuilderOptions} from '@rainbow-o23/n4';
import {StepBuilder} from './common';
import {StepBuilderCatchCatchable} from './fragmentary';
import {TypeOrmStepDataSourceBuilder, TypeOrmStepTransactionBuilder} from './typeorm';

export class TypeOrmStepSnippetBuilder<I, O> extends StepBuilder<TypeOrmBySnippetPipelineStepBuilderOptions, I, O> {
	public execute<IFrg = I, OFrg = O>(func: TypeOrmPerformFunc<I, IFrg, OFrg>): StepBuilderCatchCatchable<TypeOrmBySnippetPipelineStepBuilderOptions, I, O> {
		this.options.snippet = func;
		return new StepBuilderCatchCatchable<TypeOrmBySnippetPipelineStepBuilderOptions, I, O>(this.def);
	}
}

export class TypeOrmStepTransactionAndSnippetBuilder<I, O> extends TypeOrmStepTransactionBuilder<TypeOrmBySnippetPipelineStepBuilderOptions, I, O, TypeOrmStepSnippetBuilder<I, O>> {
	protected createNextBuilder(): TypeOrmStepSnippetBuilder<I, O> {
		return new TypeOrmStepSnippetBuilder<I, O>(this.def);
	}
}

export class TypeOrmSnippetStepBuilder<I, O> extends TypeOrmStepDataSourceBuilder<TypeOrmBySnippetPipelineStepBuilderOptions, I, O, TypeOrmStepTransactionAndSnippetBuilder<I, O>> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.TYPEORM_BY_SNIPPET});
	}

	protected createNextBuilder(): TypeOrmStepTransactionAndSnippetBuilder<I, O> {
		return new TypeOrmStepTransactionAndSnippetBuilder<I, O>(this.def);
	}
}
