import {ValidationResult} from '@rainbow-n12/shared-model';
import {Steps} from '../utils';

export interface PreparedDataAndValidation<T> {
	data: T;
	validationResult: ValidationResult;
}

/**
 * prepare {@link ValidationResult} for further usage, wrap given factor and returns {@link PreparedDataAndValidation}
 */
export const PrepareForValidation = Steps.snippet<any, PreparedDataAndValidation<any>>('PrepareForValidation')
	.execute(async $factor => {
		return {data: $factor, validationResult: new ValidationResult()};
	})
	.end();
