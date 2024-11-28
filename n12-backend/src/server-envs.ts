import {Undefinable} from '@rainbow-n12/shared-model';
import {DecimalInRangeOptions} from '@rainbow-n19/n1/src/lib/value-operators/test-decimal-actions';
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
		return this.getNumber(ServiceConfigConst.MaxPageSize, 100);
	}

	public get DEFAULT_PAGE_SIZE() {
		return this.getNumber(ServiceConfigConst.DefaultPageSize, 20);
	}

	public get PAGE_SIZE_RANGE(): DecimalInRangeOptions {
		return {min: 0, max: ServerConfig.MAX_PAGE_SIZE, interval: 'lo'};
	}
}

export const ServiceConfigConst = {
	// pageable
	MaxPageSize: 'app.page.max.size',
	DefaultPageSize: 'app.page.default.size',
	// authentication
	AuthJwtEnabled: 'app.authentication.jwt.enabled'
} as const;
export const ServerConfig = new ConfigDelegate();
