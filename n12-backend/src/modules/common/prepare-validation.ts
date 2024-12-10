import {ValidationResult} from '@rainbow-n12/shared-model';
import {buildSnippet, Steps} from '../utils';

export interface PreparedDataAndValidation<T> {
	data: T;
	validationResult: ValidationResult;
}

/**
 * prepare {@link ValidationResult} for further usage, wrap given factor and returns {@link PreparedDataAndValidation}
 */
export const PrepareForValidation = Steps.snippet('PrepareForValidation', {
	snippet: buildSnippet<any, PreparedDataAndValidation<any>>(async $factor => {
		return {data: $factor, validationResult: new ValidationResult()};
	})
});
