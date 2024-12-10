import {buildConditionalCheck, buildSnippet, ServiceApiPublisher, Steps} from '../utils';
import {Authenticate as AuthenticateApi} from './constants';
import {JwtAuthenticationProvider} from './jwt-authenticate';
import {AuthenticationProvider, Authorization, AuthorizationRequest, MightBeAuthorized} from './types';

export const Authenticate = () => {
	const createAuthorizeStep = (provider: AuthenticationProvider) => {
		return Steps.conditional(provider.name, {
			check: buildConditionalCheck<MightBeAuthorized>(async ($factor, _, $) => {
				return $factor.authorization?.authorized !== true && provider.should($.$config);
			}),
			steps: provider.createSteps()
		});
	};
	const PrepareRequest = Steps.snippet('PrepareAuthorizationRequest', {
		snippet: buildSnippet<AuthorizationRequest, MightBeAuthorized>(async ($factor) => {
			// create an authorization request, which not authorized yet
			return {request: $factor, authorization: {authorized: false, roles: []}} as MightBeAuthorized;
		})
	});
	const GetAuthorization = Steps.snippet('GetAuthorization', {
		snippet: buildSnippet<MightBeAuthorized, Authorization>(async ($factor) => {
			return $factor.authorization ?? {authorized: false, roles: []};
		})
	});
	const authenticationProviders: Array<AuthenticationProvider> = [
		new JwtAuthenticationProvider()
	];
	const Authorize = Steps.sets('Authorize', {
		steps: [
			PrepareRequest,
			...authenticationProviders.map(createAuthorizeStep),
			GetAuthorization
		]
	});

	return ServiceApiPublisher
		.use(AuthenticateApi)
		.enable()
		.steps(Authorize)
		.publish();
};
