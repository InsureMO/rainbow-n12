import {APIPublisher, snippet, useSnippet} from '../utils';
import {ImportDataRoutes} from './routes';

interface AskImportConfigRequest {
	type?: string;
	pageSize?: number;
	pageNumber?: number;
}

export const AskImportConfigList = () => {
	const ValidateCriteria = useSnippet('Validate criteria', {
		snippet: snippet<AskImportConfigRequest, AskImportConfigRequest>(async ($factor, _, $) => {
			const {type, pageSize, pageNumber} = $factor ?? {};
			return {
				type,
				pageSize: $.touch(pageSize).isInRange({
					min: 0, max: 100, interval: 'lo'
				}).toFixed0.toNumber.orUseDefault(20).value<number>(),
				pageNumber: $.touch(pageNumber).isPositive.toFixed0.toNumber.orUseDefault(1).value<number>()
			};
		})
	});

	return APIPublisher
		.use(ImportDataRoutes.AskImportConfigList)
		.authenticated()
		.enable()
		.steps(ValidateCriteria)
		.publish();
};
