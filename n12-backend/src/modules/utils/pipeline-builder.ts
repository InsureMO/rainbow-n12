import {PipelineStepDef} from '@rainbow-o23/n4';
import {APIDefMeta, RestAPI} from '../types';
import {asT} from './functions';

type IngMeta = Partial<RestAPI>;

abstract class IngMetaBuilder {
	public constructor(protected readonly meta: IngMeta) {
	}

	protected createEnablementBuilder(): EnablementBuilder {
		return new EnablementBuilder(this.meta);
	}

	protected createRequestAndResponseBuilder(): RequestAndResponseBuilder {
		return new RequestAndResponseBuilder(this.meta);
	}
}

class AuthenticationBuilder extends IngMetaBuilder {
	protected addAuthentication(func: () => void): EnablementBuilder {
		func();
		return this.createEnablementBuilder();
	}

	permitAll(): EnablementBuilder {
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

class EnablementBuilder extends IngMetaBuilder {
	enable(): RequestAndResponseBuilder {
		this.meta.enabled = true;
		return this.createRequestAndResponseBuilder();
	}

	disable(): RequestAndResponseBuilder {
		this.meta.enabled = false;
		return this.createRequestAndResponseBuilder();
	}
}

class StepsBuilder extends IngMetaBuilder {
	steps(step: PipelineStepDef, ...moreSteps: Array<PipelineStepDef>): RestAPIPublisher {
		this.meta.steps = [step, ...moreSteps];
		return new RestAPIPublisher(this.meta);
	}
}

class RequestAndResponseBuilder extends StepsBuilder {
	/** after define request, response should be defined */
	request(): RequestBuilder {
		return new RequestBuilder(this.meta);
	}

	/** after define response, steps should be defined */
	response(): Omit<RequestAndResponseBuilder, 'request' | 'response'> {
		return new ResponseBuilder(this.meta);
	}
}

class ResponseBuilder extends StepsBuilder {

}

class RequestBuilder extends ResponseBuilder {
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

class RestAPIPublisher extends IngMetaBuilder {
	publish(): RestAPI {
		return asT<RestAPI>(this.meta);
	}
}

export class APIPublisher {
	// noinspection JSUnusedLocalSymbols
	private constructor() {
		// avoid extend
	}

	public static use(meta: APIDefMeta): AuthenticationBuilder {
		return new AuthenticationBuilder(meta);
	}
}