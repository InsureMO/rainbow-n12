import {PipelineCode} from '@rainbow-n12/shared-model';
import {
	Config,
	ErrorCodes,
	Pipeline,
	PIPELINE_STEP_RETURN_NULL,
	PipelineOptions,
	PipelineRepository,
	UncatchableError
} from '@rainbow-o23/n1';
import {ServiceConfigConst} from '../../server-envs';
import {asT, buildSnippet, notNull, ServiceApiPublisher, Steps} from '../utils';
import {AuthenticateConstants} from './constants';
import {AuthenticationProvider, Authorization, AuthorizationRequest} from './types';

class PipelineAuthenticationProvider implements AuthenticationProvider {
	public constructor(private readonly pipelineCode: PipelineCode) {
	}

	async authenticate(request: AuthorizationRequest, options: Pick<PipelineOptions, 'config' | 'logger'>): Promise<Authorization> {
		type AuthenticatePipeline = Pipeline<AuthorizationRequest, Authorization | null | undefined | typeof PIPELINE_STEP_RETURN_NULL>;

		const pipeline = asT<AuthenticatePipeline>(await PipelineRepository.findPipeline(this.pipelineCode, options));
		if (pipeline == null) {
			const error = new UncatchableError(ErrorCodes.ERR_PIPELINE_NOT_FOUND, `Pipeline[code=${this.pipelineCode}] not found.`);
			options.logger.error(error.message, error.stack, this.constructor.name);
			throw error;
		} else {
			const result = await pipeline.perform({payload: request});
			const {payload} = result;
			if (payload == null || payload === PIPELINE_STEP_RETURN_NULL) {
				return {authorized: false, roles: []};
			} else {
				return payload;
			}
		}
	}
}

class AuthenticationManager {
	private readonly providers: Array<AuthenticationProvider>;

	public constructor(config: Config) {
		this.providers = [{
			enabled: config.getBoolean(ServiceConfigConst.AuthJwtEnabled),
			provide: () => new PipelineAuthenticationProvider(AuthenticateConstants.JwtAuthenticate.code)
		}]
			.map(({enabled, provide}) => enabled ? provide() : null)
			.filter(notNull);
	}

	async authenticate(request: AuthorizationRequest, options: Pick<PipelineOptions, 'config' | 'logger'>): Promise<Authorization> {
		for (const provider of this.providers) {
			const result = await provider.authenticate(request, options);
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
	// construct one, singleton
	let authenticationManager: AuthenticationManager = null;
	const Authorize = Steps.snippet('Authorize', {
		snippet: buildSnippet<AuthorizationRequest, Authorization>(async ($factor, _, $) => {
			if (authenticationManager == null) {
				authenticationManager = new AuthenticationManager($.$config);
			}
			return await authenticationManager.authenticate($factor, {config: $.$config, logger: $.$logger});
		})
	});

	return ServiceApiPublisher
		.use(AuthenticateConstants.Authenticate)
		.enable()
		.steps(Authorize)
		.publish();
};
