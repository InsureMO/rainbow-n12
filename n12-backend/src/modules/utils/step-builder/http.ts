import {
	HttpGenerateBody,
	HttpGenerateHeaders,
	HttpGenerateResponse,
	HttpGenerateUrl,
	HttpHandleError
} from '@rainbow-o23/n3';
import {DefaultSteps, FetchPipelineStepBuilderOptions} from '@rainbow-o23/n4';
import {StepBuilder} from './common';
import {StepBuilderCatchCatchable, StepBuilderConvertInput} from './fragmentary';

export class HttpFetchStepResponseErrorHandlingBuilder<I, O> extends StepBuilderCatchCatchable<FetchPipelineStepBuilderOptions, I, O> {
	public handleResponseError<IFrg = I, OFrg = O>(func: HttpHandleError<I, IFrg, OFrg>): StepBuilderCatchCatchable<FetchPipelineStepBuilderOptions, I, O> {
		this.options.responseErrorHandles = func;
		return new StepBuilderCatchCatchable<FetchPipelineStepBuilderOptions, I, O>(this.def);
	}
}

export class HttpFetchStepResponseReadBuilder<I, O> extends HttpFetchStepResponseErrorHandlingBuilder<I, O> {
	public readResponseBy<IFrg = I, OFrg = O>(func: HttpGenerateResponse<I, IFrg, OFrg>): HttpFetchStepResponseErrorHandlingBuilder<I, O> {
		this.options.readResponse = func;
		return new HttpFetchStepResponseErrorHandlingBuilder<I, O>(this.def);
	}
}

export class HttpFetchStepTimeoutBuilder<I, O> extends HttpFetchStepResponseReadBuilder<I, O> {
	public shouldTimeoutInSeconds(timeout: number) {
		this.options.timeout = timeout;
		return new HttpFetchStepResponseReadBuilder<I, O>(this.def);
	}
}

export class HttpFetchStepBodyBuilder<I, O> extends HttpFetchStepTimeoutBuilder<I, O> {
	public omitRequestBody(): HttpFetchStepTimeoutBuilder<I, O> {
		this.options.bodyUsed = false;
		delete this.options.generateBody;
		return new HttpFetchStepTimeoutBuilder<I, O>(this.def);
	}

	public buildRequestBodyBy<IFrg = I, BodyData = IFrg>(func: HttpGenerateBody<I, IFrg, BodyData>): HttpFetchStepTimeoutBuilder<I, O> {
		this.options.bodyUsed = true;
		this.options.generateBody = func;
		return new HttpFetchStepTimeoutBuilder<I, O>(this.def);
	}
}

export class HttpFetchStepHeadersGeneratorBuilder<I, O> extends HttpFetchStepBodyBuilder<I, O> {
	public generateRequestHeadersBy<IFrg = I>(func: HttpGenerateHeaders<I, IFrg>): HttpFetchStepBodyBuilder<I, O> {
		this.options.generateHeaders = func;
		return new HttpFetchStepBodyBuilder<I, O>(this.def);
	}
}

export class HttpFetchStepUrlGenerateBuilder<I, O> extends HttpFetchStepHeadersGeneratorBuilder<I, O> {
	public decoratedUrlBy<IFrg = I>(func: HttpGenerateUrl<I, IFrg>): HttpFetchStepHeadersGeneratorBuilder<I, O> {
		this.options.decorateUrl = func;
		return new HttpFetchStepHeadersGeneratorBuilder<I, O>(this.def);
	}
}

export class HttpFetchStepSystemAndEndpointBuilder<I, O> extends StepBuilder<FetchPipelineStepBuilderOptions, I, O> {
	public exchangeWithEndpoint(systemCode: string, endpointName: string): HttpFetchStepUrlGenerateBuilder<I, O> {
		this.options.system = systemCode;
		this.options.endpoint = endpointName;
		return new HttpFetchStepUrlGenerateBuilder<I, O>(this.def);
	}
}

export class HttpFetchStepBuilder<I, O> extends StepBuilderConvertInput<FetchPipelineStepBuilderOptions, I, O> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.HTTP_FETCH});
	}

	public usePost(): HttpFetchStepSystemAndEndpointBuilder<I, O> {
		this.options.method = 'post';
		return new HttpFetchStepSystemAndEndpointBuilder<I, O>(this.def);
	}

	public useGet(): HttpFetchStepSystemAndEndpointBuilder<I, O> {
		this.options.method = 'get';
		return new HttpFetchStepSystemAndEndpointBuilder<I, O>(this.def);
	}
}

export class HttpPostStepBuilder<I, O> extends HttpFetchStepSystemAndEndpointBuilder<I, O> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.HTTP_FETCH});
		this.options.method = 'post';
	}
}

export class HttpGetStepBuilder<I, O> extends HttpFetchStepSystemAndEndpointBuilder<I, O> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.HTTP_FETCH});
		this.options.method = 'get';
	}
}
