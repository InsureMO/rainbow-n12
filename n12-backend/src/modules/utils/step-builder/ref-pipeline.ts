import {PipelineCode} from '@rainbow-o23/n1';
import {DefaultSteps, RefPipelinePipelineStepBuilderOptions} from '@rainbow-o23/n4';
import {StepBuilderCatchCatchable, StepBuilderConvertInput} from './fragmentary';

export class RefPipelineStepBuilder<I, O> extends StepBuilderConvertInput<RefPipelinePipelineStepBuilderOptions, I, O> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.REF_PIPELINE});
	}

	public call(pipelineCode: PipelineCode): StepBuilderCatchCatchable<RefPipelinePipelineStepBuilderOptions, I, O> {
		this.options.ref = pipelineCode;
		return new StepBuilderCatchCatchable<RefPipelinePipelineStepBuilderOptions, I, O>(this.def);
	}
}
