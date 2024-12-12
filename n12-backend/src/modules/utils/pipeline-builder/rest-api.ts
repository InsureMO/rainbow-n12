import {RestAPI, RestApiMeta} from '../../types';
import {asT} from '../functions';
import {AbstractEnablementBuilder, AbstractStepsBuilder, IngMetaBuilder} from './common';
import {RestApiIngMeta} from './types';

export class RestApiAuthenticationBuilder extends IngMetaBuilder<RestApiIngMeta> {
	private createApiEnablementBuilder(): RestApiEnablementBuilder {
		return new RestApiEnablementBuilder(this.meta);
	}

	private addAuthentication(func: () => void): RestApiEnablementBuilder {
		func();
		return this.createApiEnablementBuilder();
	}

	permitAll(): RestApiEnablementBuilder {
		return this.addAuthentication(() => delete this.meta.authorizations);
	}

	anonymous() {
		return this.addAuthentication(() => this.meta.authorizations = 'anonymous');
	}

	authenticated() {
		return this.addAuthentication(() => this.meta.authorizations = 'authenticated');
	}

	permissions(permissionCode: string, ...otherPermissionCodes: Array<string>) {
		return this.addAuthentication(() => this.meta.authorizations = [permissionCode, ...otherPermissionCodes]);
	}
}

export class RestApiEnablementBuilder extends AbstractEnablementBuilder<RestApiRequestAndResponseBuilder, RestApiIngMeta> {
	protected createRequestAndResponseBuilder(): RestApiRequestAndResponseBuilder {
		return new RestApiRequestAndResponseBuilder(this.meta);
	}
}

export class RestApiStepsBuilder extends AbstractStepsBuilder<RestApiBuilder, RestApiIngMeta> {
	protected createPublisher(): RestApiBuilder {
		return new RestApiBuilder(this.meta);
	}
}

export class RestApiRequestAndResponseBuilder extends RestApiStepsBuilder {
	/** after define request, response should be defined */
	request(): RestApiRequestBuilder {
		return new RestApiRequestBuilder(this.meta);
	}

	/** after define response, steps should be defined */
	response(): Omit<RestApiRequestAndResponseBuilder, 'request' | 'response'> {
		return new RestApiResponseBuilder(this.meta);
	}
}

export class RestApiResponseBuilder extends RestApiStepsBuilder {
	// TODO build rest api response
}

export class RestApiRequestBuilder extends RestApiResponseBuilder {
	headers(...headerNames: Array<string>): this {
		if (headerNames == null || headerNames.length === 0) {
			this.meta.headers = true;
		} else {
			this.meta.headers = headerNames;
		}
		return this;
	}

	pathParams(...paramNames: Array<string>): this {
		if (paramNames == null || paramNames.length === 0) {
			this.meta.pathParams = true;
		} else {
			this.meta.pathParams = paramNames;
		}
		return this;
	}

	searchParams(...paramNames: Array<string>): this {
		if (paramNames == null || paramNames.length === 0) {
			this.meta.queryParams = true;
		} else {
			this.meta.queryParams = paramNames;
		}
		return this;
	}

	/** enable body */
	body(): this {
		this.meta.body = true;
		return this;
	}

	/** disable body */
	bodyless(): this {
		this.meta.body = false;
		return this;
	}
}

export class RestApiBuilder extends IngMetaBuilder<RestApiIngMeta> {
	publish(): RestAPI {
		return asT<RestAPI>(this.meta);
	}
}

export class RestApiPublisher {
	// noinspection JSUnusedLocalSymbols
	private constructor() {
		// avoid extend
	}

	public static use(meta: RestApiMeta): RestApiAuthenticationBuilder {
		return new RestApiAuthenticationBuilder(meta);
	}
}
