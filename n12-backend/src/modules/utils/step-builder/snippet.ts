import {PerformFunc} from '@rainbow-o23/n3';
import {DefaultSteps, SnippetPipelineStepBuilderOptions} from '@rainbow-o23/n4';
import {StepBuilderCatchCatchable, StepBuilderConvertInput} from './fragmentary';

export class SnippetStepBuilder<I, O> extends StepBuilderConvertInput<SnippetPipelineStepBuilderOptions, I, O> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.SNIPPET});
	}

	public execute<IFrg = I, OFrg = O>(func: PerformFunc<I, IFrg, OFrg>): StepBuilderCatchCatchable<SnippetPipelineStepBuilderOptions, I, O> {
		this.options.snippet = func;
		return new StepBuilderCatchCatchable<SnippetPipelineStepBuilderOptions, I, O>(this.def);
	}
}
