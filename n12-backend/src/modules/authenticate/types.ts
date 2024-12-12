import {Authentication, TenantCode, TenantId} from '@rainbow-n12/shared-model';
import {Config, PipelineRequestAuthorization} from '@rainbow-o23/n1';
import {PipelineStepDef} from '@rainbow-o23/n4';
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
	// at least one step provided
	createSteps(): [PipelineStepDef, ...Array<PipelineStepDef>];
}

/**
 * {@link #tenantId} and {@link #tenantCode} are available for multiple tenant enabled only.
 * when they are not provided, the username must be unique in system.
 */
export interface NamePwdCredentials {
	tenantId?: TenantId;
	tenantCode?: TenantCode;
	username: string;
	password: string;
}
