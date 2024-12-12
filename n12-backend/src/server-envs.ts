import {Undefinable} from '@rainbow-n12/shared-model';
import {DecimalInRangeOptions} from '@rainbow-n19/n1';
import {Config} from '@rainbow-o23/n1';
import {BootstrapOptions} from '@rainbow-o23/n2';

const SINGLETON: { config?: Config } = {};

export const useAskConfigurationAnywhere = async (options: BootstrapOptions) => {
	SINGLETON.config = options.getConfig();
};

class ConfigDelegate implements Pick<Config, 'getBoolean' | 'getNumber' | 'getString' | 'getJson'> {
	public getBoolean(name: string, defaultValue: boolean | undefined): Undefinable<boolean> {
		return SINGLETON.config.getBoolean(name, defaultValue);
	}

	public getJson<R>(name: string, defaultValue: R | undefined): Undefinable<R> {
		return SINGLETON.config.getJson(name, defaultValue);
	}

	public getNumber(name: string, defaultValue: number | undefined): Undefinable<number> {
		return SINGLETON.config.getNumber(name, defaultValue);
	}

	public getString(name: string, defaultValue: string | undefined): Undefinable<string> {
		return SINGLETON.config.getString(name, defaultValue);
	}

	public get MAX_PAGE_SIZE() {
		return this.getNumber(ServerConfigConst.MaxPageSize, 100);
	}

	public get DEFAULT_PAGE_SIZE() {
		return this.getNumber(ServerConfigConst.DefaultPageSize, 20);
	}

	public get PAGE_SIZE_RANGE(): DecimalInRangeOptions {
		return {min: 0, max: ServerConfig.MAX_PAGE_SIZE, interval: 'lo'};
	}

	public get JWT_AUTH_ENABLED(): boolean {
		return this.getBoolean(ServerConfigConst.AuthJwtEnabled, false);
	}

	public get JWT_AUTH_SECURITY_KEY(): string {
		return this.getString(ServerConfigConst.AuthJwtSecurityKey, '');
	}

	public get USER_PWD_SIGNIN_ENABLED(): boolean {
		return this.getBoolean(ServerConfigConst.UserPwdSigninEnabled, false);
	}

	public get MULTIPLE_TENANT_ENABLED(): boolean {
		return this.getBoolean(ServerConfigConst.MultipleTenantEnabled, false);
	}
}

export const ServerConfigConst = {
	// pageable
	MaxPageSize: 'app.page.max.size',
	DefaultPageSize: 'app.page.default.size',
	// authentication, jwt
	AuthJwtEnabled: 'app.authentication.jwt.enabled',
	AuthJwtSecurityKey: 'app.authentication.jwt.security.key',
	// authentication, user+pwd sign-in
	UserPwdSigninEnabled: 'app.user.pwd.signin.enabled',
	// tenant, organization related
	MultipleTenantEnabled: 'app.tenant.multiple.enabled'
} as const;
export const ServerConfig = new ConfigDelegate();
