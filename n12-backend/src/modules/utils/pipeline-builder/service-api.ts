import {DefMeta, ServiceAPI} from '../../types';
import {asT} from '../functions';
import {AbstractEnablementBuilder, AbstractStepsBuilder, IngMetaBuilder} from './common';
import {ServiceApiIngMeta} from './types';

export class ServiceApiEnablementBuilder extends AbstractEnablementBuilder<ServiceApiStepsBuilder, ServiceApiIngMeta> {
	protected createRequestAndResponseBuilder(): ServiceApiStepsBuilder {
		return new ServiceApiStepsBuilder(this.meta);
	}
}

export class ServiceApiStepsBuilder extends AbstractStepsBuilder<ServiceApiBuilder, ServiceApiIngMeta> {
	protected createPublisher(): ServiceApiBuilder {
		return new ServiceApiBuilder(this.meta);
	}
}

export class ServiceApiBuilder extends IngMetaBuilder<ServiceApiIngMeta> {
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