import {DefaultSteps, FragmentaryPipelineStepBuilderOptions} from '@rainbow-o23/n4';
import {StepBuilderConvertInput} from './fragmentary';

export class SnowflakeStepBuilder<I, O> extends StepBuilderConvertInput<FragmentaryPipelineStepBuilderOptions, I, O> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.SNOWFLAKE});
	}
}
