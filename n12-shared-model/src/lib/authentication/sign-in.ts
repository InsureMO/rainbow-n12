import {TenantCode, TenantId} from '../common';
import {InteractionRequest, SuccessInteractionResponse} from '../interaction';
import {Authentication} from './authentication';

/** sign-in by user+pwd */
export interface SignInRequest extends InteractionRequest {
	username?: string;
	password?: string;
	/** sign in to tenant, if not given, sign in to default tenant */
	tenantId?: TenantId;
	/**
	 * sign in to tenant, if not given, sign in to default tenant
	 * ignore when tenant id is given
	 */
	tenantCode?: TenantCode;
}

/** no 2-factors, returns token */
export interface SignInResponseData extends Authentication {
	token: string;
}

/** no 2-factors signed-in response */
export type SignInResponse = SuccessInteractionResponse<SignInResponseData>;

/** with 2-factors, returns proof to client, to prove username */
export interface SignInForTwoFactorResponseData {
	proof: string;
}

/** with 2-factors response after sign-in by user+pwd */
export type SignInForTwoFactorResponse = SuccessInteractionResponse<SignInForTwoFactorResponseData>;

/** sign-in by 2nd-factor, and proof to prove username */
export interface TwoFactorKeyRequest extends InteractionRequest {
	/** proof is given by server side, to prove username */
	proof: string;
	/** 2nd-factor key */
	key?: string;
}

/** with 2-factors, returns token */
export interface TwoFactorSignInResponseData extends Authentication {
	token: string;
}

/** with 2-factors, signed-in response */
export type TwoFactorSignInResponse = SuccessInteractionResponse<TwoFactorSignInResponseData>;
