import {Authentication} from '@rainbow-n12/shared-model';
import {Config, Logger, PipelineOptions, PipelineRequestAuthorization} from '@rainbow-o23/n1';
import {Request} from 'express';

export interface AuthorizationRequest {
	request: Request;
	authorization?: string;
}

export type Authorization = PipelineRequestAuthorization<Authentication>;

export interface AuthenticationProvider {
	/**
	 * never throw exception, just return yes or no
	 * and carry authorization/authentication details if return yes
	 */
	authenticate(request: AuthorizationRequest, options: Pick<PipelineOptions, 'config' | 'logger'>): Promise<Authorization>;
}
