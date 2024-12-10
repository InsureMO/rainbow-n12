import {ValidationFailedResponse} from '@rainbow-n12/shared-model';
import {PipelineStepDef} from '@rainbow-o23/n4';
import {buildConditionalCheck, buildSnippet, Steps} from '../utils';
import {PreparedDataAndValidation} from './prepare-validation';

export const ResponseOnValidationNotOkOrElse = (step1: PipelineStepDef, ...steps: Array<PipelineStepDef>) => {
	return Steps.conditional('ResponseOnValidationNotOk', {
		check: buildConditionalCheck<PreparedDataAndValidation<any>>(async ($factor) => !$factor.validationResult.ok()),
		steps: [Steps.snippet('ResponseValidationFailed', {
			snippet: buildSnippet<PreparedDataAndValidation<any>, ValidationFailedResponse>(async ($factor, _, $) => {
				return $factor.validationResult.toResponse();
			})
		})],
		otherwise: [step1, ...steps]
	});
};
