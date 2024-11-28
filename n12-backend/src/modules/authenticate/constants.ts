import {asServiceApi} from '../utils';

export class AuthenticateConstants {
	static readonly Authenticate = asServiceApi('Authenticate');
	static readonly JwtAuthenticate = asServiceApi('JwtAuthenticate');

	// noinspection JSUnusedLocalSymbols
	private constructor() {
		// avoid extend
	}
}
