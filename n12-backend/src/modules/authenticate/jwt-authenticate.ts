import {buildSnippet, ServiceApiPublisher, Steps} from '../utils';
import {AuthenticateConstants} from './constants';
import {Authorization, AuthorizationRequest} from './types';

export const JwtAuthenticate = () => {
	const Authorize = Steps.snippet('Authorize', {
		snippet: buildSnippet<AuthorizationRequest, Authorization>(async ($factor) => {
			// TODO
			return null;
		})
	});

	return ServiceApiPublisher
		.use(AuthenticateConstants.JwtAuthenticate)
		.enable()
		.steps(Authorize)
		.publish();
};
