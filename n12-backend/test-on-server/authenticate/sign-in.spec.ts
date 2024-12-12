import {SignInRequest, ValidateLevel, ValidationFailedResponse} from '@rainbow-n12/shared-model';
import {ErrPasswordMustProvided, ErrUserNameMustProvided, SignIn} from '../../src/modules/authenticate/constants';
import {postNoHeader, toAbsUrl} from '../common';

describe('POST /sign-in', () => {
	const usernameNotProvided = {
		code: ErrUserNameMustProvided,
		message: 'User name must be provided.',
		location: 'username',
		level: ValidateLevel.ERROR
	};
	const passwordNotProvided = {
		code: ErrPasswordMustProvided,
		message: 'Password must be provided.',
		location: 'password',
		level: ValidateLevel.ERROR
	};

	test('no data provided', async () => {
		// noinspection DuplicatedCode
		const response = await postNoHeader<SignInRequest>(toAbsUrl(SignIn.route), {});
		expect(response.status).toBe(200);
		const data: ValidationFailedResponse = await response.json();
		expect(data.code).toBe('R-00001');
		const {data: errors} = data;
		expect(errors.length).toBe(2);
		expect(errors[0]).toEqual(usernameNotProvided);
		expect(errors[1]).toEqual(passwordNotProvided);
	});

	test('no username only', async () => {
		// noinspection DuplicatedCode
		const response = await postNoHeader<SignInRequest>(toAbsUrl(SignIn.route), {
			password: 'abc'
		});
		expect(response.status).toBe(200);
		const data: ValidationFailedResponse = await response.json();
		expect(data.code).toBe('R-00001');
		const {data: errors} = data;
		expect(errors.length).toBe(1);
		expect(errors[0]).toEqual(usernameNotProvided);
	});

	test('no password only', async () => {
		// noinspection DuplicatedCode
		const response = await postNoHeader<SignInRequest>(toAbsUrl(SignIn.route), {
			username: 'abc'
		});
		expect(response.status).toBe(200);
		const data: ValidationFailedResponse = await response.json();
		expect(data.code).toBe('R-00001');
		const {data: errors} = data;
		expect(errors.length).toBe(1);
		expect(errors[0]).toEqual(passwordNotProvided);
	});
});
