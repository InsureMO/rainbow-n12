import {ConditionalStepBuilder} from './conditional';
import {SetsStepBuilder} from './sets';
import {SnippetStepBuilder} from './snippet';
import {TypeOrmLoadManyBySQLStepBuilder} from './typeorm-load-many';
import {TypeOrmLoadOneBySQLStepBuilder} from './typeorm-load-one';

export * from './common';
export * from './fragmentary';

export * from './snippet';

export * from './sets';
export * from './conditional';

export * from './typeorm';
export * from './typeorm-load-one';
export * from './typeorm-load-many';

export const Steps = {
	snippet: <In, Out>(name: string) => new SnippetStepBuilder<In, Out>(name),
	sets: <In, Out>(name: string) => new SetsStepBuilder<In, Out>(name),
	conditional: <In, Out>(name: string) => new ConditionalStepBuilder<In, Out>(name),
	loadOneBySQL: <In, Out>(name: string) => new TypeOrmLoadOneBySQLStepBuilder<In, Out>(name),
	loadManyBySQL: <In, Out>(name: string) => new TypeOrmLoadManyBySQLStepBuilder<In, Out>(name)
};
