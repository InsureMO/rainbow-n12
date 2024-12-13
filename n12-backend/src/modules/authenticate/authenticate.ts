import {ServiceApiPublisher, Steps} from '../utils';
import {Authenticate as AuthenticateApi} from './constants';
import {JwtAuthenticationProvider} from './jwt-authenticate';
import {AuthenticationProvider, Authorization, AuthorizationRequest, MightBeAuthorized} from './types';

export const Authenticate = () => {
	const createAuthorizeStep = (provider: AuthenticationProvider) => {
		const [step1, ...steps] = provider.createSteps();
		return Steps.conditional<MightBeAuthorized, MightBeAuthorized>(provider.name)
			.testBy(async ($factor, _, $) => {
				return $factor.authorization?.authorized !== true && provider.should($.$config);
			})
			.then(step1, ...steps)
			.end();
	};
	const PrepareRequest = Steps.snippet<AuthorizationRequest, MightBeAuthorized>('PrepareAuthorizationRequest')
		.execute(async ($factor) => {
			// create an authorization request, which not authorized yet
			return {request: $factor, authorization: {authorized: false, roles: []}} as MightBeAuthorized;
		});
	const GetAuthorization = Steps.snippet<MightBeAuthorized, Authorization>('GetAuthorization')
		.execute(async ($factor) => {
			return $factor.authorization ?? {authorized: false, roles: []};
		});
	const authenticationProviders: Array<AuthenticationProvider> = [
		new JwtAuthenticationProvider()
	];
	const Authorize = Steps.sets('Authorize')
		.steps(PrepareRequest, ...authenticationProviders.map(createAuthorizeStep), GetAuthorization);

	return ServiceApiPublisher
		.use(AuthenticateApi)
		.enable()
		.steps(Authorize)
		.publish();
};
