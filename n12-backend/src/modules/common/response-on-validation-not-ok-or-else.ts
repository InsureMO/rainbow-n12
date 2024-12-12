import {ValidationFailedResponse} from '@rainbow-n12/shared-model';
import {BuiltStep, Steps} from '../utils';
import {PreparedDataAndValidation} from './prepare-validation';

export const ResponseOnValidationNotOkOrElse = (step1: BuiltStep, ...steps: Array<BuiltStep>) => {
	return Steps.conditional<PreparedDataAndValidation<any>, ValidationFailedResponse | any>('ResponseOnValidationNotOk')
		.testBy(async ($factor) => !$factor.validationResult.ok())
		.then(
			Steps.snippet<PreparedDataAndValidation<any>, ValidationFailedResponse>('ResponseValidationFailed')
				.execute(async $factor => {
					return $factor.validationResult.toResponse();
				})
		)
		.otherwise(step1, ...steps)
		.end();
};
