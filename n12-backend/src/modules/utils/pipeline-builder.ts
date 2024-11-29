import {PipelineStepDef} from '@rainbow-o23/n4';
import {RestApiMeta, DefMeta, RestAPI, ServiceAPI} from '../types';
import {asT} from './functions';

type IngMeta = Partial<RestAPI>;

abstract class IngMetaBuilder {
	public constructor(protected readonly meta: IngMeta) {
	}
}

abstract class AbstractEnablementBuilder<NextBuilder> extends IngMetaBuilder {
	protected abstract createRequestAndResponseBuilder(): NextBuilder;

	enable(): NextBuilder {
		this.meta.enabled = true;
		return this.createRequestAndResponseBuilder();
	}

	disable(): NextBuilder {
		this.meta.enabled = false;
		return this.createRequestAndResponseBuilder();
	}
}

abstract class AbstractStepsBuilder<Publisher> extends IngMetaBuilder {
	protected abstract createPublisher(): Publisher;

	steps(step: PipelineStepDef, ...moreSteps: Array<PipelineStepDef>): Publisher {
		this.meta.steps = [step, ...moreSteps];
		return this.createPublisher();
	}
}

class RestApiAuthenticationBuilder extends IngMetaBuilder {
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

	roles(role: string, ...restRoles: Array<string>) {
		return this.addAuthentication(() => this.meta.authorizations = [role, ...restRoles]);
	}
}

class RestApiEnablementBuilder extends AbstractEnablementBuilder<RestApiRequestAndResponseBuilder> {
	protected createRequestAndResponseBuilder(): RestApiRequestAndResponseBuilder {
		return new RestApiRequestAndResponseBuilder(this.meta);
	}
}

class RestApiStepsBuilder extends AbstractStepsBuilder<RestApiBuilder> {
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

class RestApiBuilder extends IngMetaBuilder {
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

class ServiceApiEnablementBuilder extends AbstractEnablementBuilder<ServiceApiApiStepsBuilder> {
	protected createRequestAndResponseBuilder(): ServiceApiApiStepsBuilder {
		return new ServiceApiApiStepsBuilder(this.meta);
	}
}

class ServiceApiApiStepsBuilder extends AbstractStepsBuilder<ServiceApiBuilder> {
	protected createPublisher(): ServiceApiBuilder {
		return new ServiceApiBuilder(this.meta);
	}
}

class ServiceApiBuilder extends IngMetaBuilder {
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