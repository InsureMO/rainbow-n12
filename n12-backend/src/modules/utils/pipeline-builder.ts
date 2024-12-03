import {PipelineStepDef} from '@rainbow-o23/n4';
import {DefMeta, RestAPI, RestApiMeta, ServiceAPI} from '../types';
import {asT} from './functions';

type RestApiIngMeta = Partial<RestAPI>;
type ServiceApiIngMeta = Partial<ServiceAPI>;
type IngMeta = RestApiIngMeta | ServiceApiIngMeta;

abstract class IngMetaBuilder<Meta extends IngMeta> {
	public constructor(protected readonly meta: Meta) {
	}
}

abstract class AbstractEnablementBuilder<NextBuilder, Meta extends IngMeta> extends IngMetaBuilder<Meta> {
	protected abstract createRequestAndResponseBuilder(): NextBuilder;

	enable(enabled: boolean = true): NextBuilder {
		this.meta.enabled = enabled;
		return this.createRequestAndResponseBuilder();
	}
}

abstract class AbstractStepsBuilder<Publisher, Meta extends IngMeta> extends IngMetaBuilder<Meta> {
	protected abstract createPublisher(): Publisher;

	steps(step: PipelineStepDef, ...moreSteps: Array<PipelineStepDef>): Publisher {
		this.meta.steps = [step, ...moreSteps];
		return this.createPublisher();
	}
}

class RestApiAuthenticationBuilder extends IngMetaBuilder<RestApiIngMeta> {
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

class RestApiEnablementBuilder extends AbstractEnablementBuilder<RestApiRequestAndResponseBuilder, RestApiIngMeta> {
	protected createRequestAndResponseBuilder(): RestApiRequestAndResponseBuilder {
		return new RestApiRequestAndResponseBuilder(this.meta);
	}
}

class RestApiStepsBuilder extends AbstractStepsBuilder<RestApiBuilder, RestApiIngMeta> {
	protected createPublisher(): RestApiBuilder {
		return new RestApiBuilder(this.meta);
	}
}

class RestApiRequestAndResponseBuilder extends RestApiStepsBuilder {
	/** after define request, response should be defined */
	request(): RestApiRequestBuilder {
		return new RestApiRequestBuilder(this.meta);
	}

	/** after define response, steps should be defined */
	response(): Omit<RestApiRequestAndResponseBuilder, 'request' | 'response'> {
		return new RestApiResponseBuilder(this.meta);
	}
}

class RestApiResponseBuilder extends RestApiStepsBuilder {
	// TODO build rest api response
}

class RestApiRequestBuilder extends RestApiResponseBuilder {
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

class RestApiBuilder extends IngMetaBuilder<RestApiIngMeta> {
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

class ServiceApiEnablementBuilder extends AbstractEnablementBuilder<ServiceApiStepsBuilder, ServiceApiIngMeta> {
	protected createRequestAndResponseBuilder(): ServiceApiStepsBuilder {
		return new ServiceApiStepsBuilder(this.meta);
	}
}

class ServiceApiStepsBuilder extends AbstractStepsBuilder<ServiceApiBuilder, ServiceApiIngMeta> {
	protected createPublisher(): ServiceApiBuilder {
		return new ServiceApiBuilder(this.meta);
	}
}

class ServiceApiBuilder extends IngMetaBuilder<ServiceApiIngMeta> {
	publish(): ServiceAPI {
		return asT<ServiceAPI>(this.meta);
	}
}

export class ServiceApiPublisher {
	// noinspection JSUnusedLocalSymbols
	private constructor() {
		// avoid extend
	}

	public static use(meta: DefMeta): ServiceApiEnablementBuilder {
		return new ServiceApiEnablementBuilder(meta);
	}
}