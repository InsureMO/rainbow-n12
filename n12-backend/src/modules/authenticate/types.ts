import {Authentication, TenantCode} from '@rainbow-n12/shared-model';
import {Config, PipelineRequestAuthorization} from '@rainbow-o23/n1';
import {PipelineStepDef, PipelineStepSetsDef} from '@rainbow-o23/n4';
import {Request} from 'express';

export interface AuthorizationRequest {
	request: Request;
	authorization?: string;
}

export type Authorization = PipelineRequestAuthorization<Authentication>;

export interface MightBeAuthorized {
	request: AuthorizationRequest;
	authorization: Authorization;
}

export interface AuthenticationProvider {
	readonly name: string;
	should: (config: Config) => boolean;
	createSteps(): Array<PipelineStepDef | PipelineStepSetsDef>;
}

export interface NamePwdCredentials {
	tenantCode?: TenantCode;
	username: string;
	password: string;
}
