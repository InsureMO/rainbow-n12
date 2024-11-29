import {ValueOperator} from '@rainbow-n19/n1';
import {Config} from '@rainbow-o23/n1';
import {PipelineStepDef, PipelineStepSetsDef} from '@rainbow-o23/n4';
import jwt from 'jsonwebtoken';
import {ServerConfig} from '../../server-envs';
import {buildSnippet, Steps} from '../utils';
import {AuthenticationProvider, Authorization, MightBeAuthorized} from './types';

export class JwtAuthenticationProvider implements AuthenticationProvider {
	readonly name: string;
	private readonly authorizeStep: PipelineStepDef;

	public constructor() {
		this.name = 'ShouldAuthenticateByJwt';
		this.authorizeStep = Steps.snippet('JwtAuthorize', {
			snippet: buildSnippet<MightBeAuthorized, Authorization>(async ($factor) => {
				// TODO do jwt authenticate
				const {request: {authorization} = {}} = $factor;
				const token = ValueOperator.of(authorization).isNotBlank().orUseDefault('').value<string>();
				try {
					const decoded = jwt.verify(token, ServerConfig.JWT_AUTH_SECURITY_KEY, {complete: false});
					return {authorized: true, authentication: {userId: '-1'}, roles: []};
				} catch {
					return {authorized: false, roles: []};
				}
			}),
			merge: 'authorization'
		});
	}

	public should(_config: Config): boolean {
		return ServerConfig.JWT_AUTH_ENABLED;
	}

	public createSteps(): Array<PipelineStepDef | PipelineStepSetsDef> {
		return [this.authorizeStep];
	}
}
