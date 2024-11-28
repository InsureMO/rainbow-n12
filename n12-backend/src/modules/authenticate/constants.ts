import {asServiceApi} from '../utils';

export class AuthenticateConstants {
	static readonly Authenticate = asServiceApi('Authenticate');

	// noinspection JSUnusedLocalSymbols
	private constructor() {
		// avoid extend
	}
}
