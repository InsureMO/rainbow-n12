import {asRestApi, asServiceApi} from '../utils';

// rest apis
export const Authenticate = asServiceApi('Authenticate');
export const SignIn = asRestApi('SignIn', '/sign-in', 'post');
export const SsoSignIn = asRestApi('SsoSignIn', '/sso-sign-in', 'post');

// errors
export const ErrUserNameMustProvided = 'N12-AUT-00001';
export const ErrPasswordMustProvided = 'N12-AUT-00002';
