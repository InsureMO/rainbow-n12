import {Authentication} from '@rainbow-n12/shared-model';
import {PipelineRequestAuthorization} from '@rainbow-o23/n1';
import {Request} from 'express';
import {buildSnippet, ServiceApiPublisher, Steps} from '../utils';
import {AuthenticateConstants} from './constants';

interface AuthorizationRequest {
	request: Request;
	authorization?: string;
}

type Authorization = PipelineRequestAuthorization<Authentication>;

interface AuthenticationProvider {
	// never throw exception, just return yes or no
	// and carry authorization/authentication details if return yes
	authenticate(request: AuthorizationRequest): Promise<Authorization>;
}

class AuthenticationManager {
	private readonly providers: Array<AuthenticationProvider> = [];

	async authenticate(request: AuthorizationRequest): Promise<Authorization> {
		for (const provider of this.providers) {
			const result = await provider.authenticate(request);
			// authenticated
			if (result.authorized) {
				return result;
			}
		}
		// fail
		return {authorized: false, roles: []};
	}
}

export const Authenticate = () => {
	const Authorize = Steps.snippet('Authorize', {
		snippet: buildSnippet<AuthorizationRequest, Authorization>(async ($factor) => {
			return await new AuthenticationManager().authenticate($factor);
		})
	});

	return ServiceApiPublisher
		.use(AuthenticateConstants.Authenticate)
		.enable()
		.steps(Authorize)
		.publish();
};
