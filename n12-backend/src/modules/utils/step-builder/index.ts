import {AsyncSetsStepBuilder} from './async-sets';
import {ConditionalStepBuilder} from './conditional';
import {EachSetsStepBuilder} from './each';
import {HttpFetchStepBuilder, HttpGetStepBuilder, HttpPostStepBuilder} from './http';
import {ParallelSetsStepBuilder} from './parallel';
import {RefPipelineStepBuilder} from './ref-pipeline';
import {RoutesSetsStepBuilder} from './routes';
import {SetsStepBuilder} from './sets';
import {SnippetStepBuilder} from './snippet';
import {SnowflakeStepBuilder} from './snowflake';
import {TypeOrmBulkSaveBySQLStepBuilder} from './typeorm-bulk-save';
import {TypeOrmLoadManyBySQLStepBuilder} from './typeorm-load-many';
import {TypeOrmLoadOneBySQLStepBuilder} from './typeorm-load-one';
import {TypeOrmSaveBySQLStepBuilder} from './typeorm-save';
import {TypeOrmSnippetStepBuilder} from './typeorm-snippet';
import {TypeormTransactionalStepBuilder} from './typeorm-transactional';
import {TypeOrmLoadManyBySQLUseCursorStepBuilder} from './typeorm-use-cursor';

export * from './common';
export * from './fragmentary';

export * from './snippet';
export * from './snowflake';

export * from './sets';
export * from './async-sets';
export * from './each';
export * from './parallel';
export * from './conditional';
export * from './routes';

export * from './typeorm';
export * from './typeorm-snippet';
export * from './typeorm-load-one';
export * from './typeorm-load-many';
export * from './typeorm-use-cursor';
export * from './typeorm-save';
export * from './typeorm-bulk-save';
export * from './typeorm-transactional';

export * from './http';

export * from './ref-pipeline';

export const Steps = {
	snippet: <In, Out>(name: string) => new SnippetStepBuilder<In, Out>(name),
	snowflake: <In, Out>(name: string) => new SnowflakeStepBuilder<In, Out>(name),

	sets: <In, Out>(name: string) => new SetsStepBuilder<In, Out>(name),
	asyncSets: <In, Out>(name: string) => new AsyncSetsStepBuilder<In, Out>(name),
	eachSets: <In, Out>(name: string) => new EachSetsStepBuilder<In, Out>(name),
	parallelSets: <In, Out>(name: string) => new ParallelSetsStepBuilder<In, Out>(name),
	conditional: <In, Out>(name: string) => new ConditionalStepBuilder<In, Out>(name),
	routes: <In, Out>(name: string) => new RoutesSetsStepBuilder<In, Out>(name),

	freeTypeOrm: <In, Out>(name: string) => new TypeOrmSnippetStepBuilder<In, Out>(name),
	loadOneBySQL: <In, Out>(name: string) => new TypeOrmLoadOneBySQLStepBuilder<In, Out>(name),
	loadManyBySQL: <In, Out>(name: string) => new TypeOrmLoadManyBySQLStepBuilder<In, Out>(name),
	loadManyBySQLUseCursor: <In, Out>(name: string) => new TypeOrmLoadManyBySQLUseCursorStepBuilder<In, Out>(name),
	saveBySQL: <In, Out>(name: string) => new TypeOrmSaveBySQLStepBuilder<In, Out>(name),
	bulkSaveBySQL: <In, Out>(name: string) => new TypeOrmBulkSaveBySQLStepBuilder<In, Out>(name),
	transactional: <In, Out>(name: string) => new TypeormTransactionalStepBuilder<In, Out>(name),

	fetch: <In, Out>(name: string) => new HttpFetchStepBuilder<In, Out>(name),
	post: <In, Out>(name: string) => new HttpPostStepBuilder<In, Out>(name),
	get: <In, Out>(name: string) => new HttpGetStepBuilder<In, Out>(name),

	callPipeline: <In, Out>(name: string) => new RefPipelineStepBuilder<In, Out>(name)
};
