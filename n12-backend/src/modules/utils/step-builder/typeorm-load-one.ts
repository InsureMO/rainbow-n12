import {DefaultSteps, TypeOrmBySQLPipelineStepBuilderOptions} from '@rainbow-o23/n4';
import {TypeOrmDataSourceStepBuilder, TypeOrmTransactionAndSqlStepBuilder} from './typeorm';

export class TypeOrmLoadOneBySQLStepBuilder<I, O> extends TypeOrmDataSourceStepBuilder<TypeOrmBySQLPipelineStepBuilderOptions, I, O, TypeOrmTransactionAndSqlStepBuilder<I, O>> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.TYPEORM_LOAD_ONE_BY_SQL});
	}

	protected createNextBuilder(): TypeOrmTransactionAndSqlStepBuilder<I, O> {
		return new TypeOrmTransactionAndSqlStepBuilder(this.def);
	}
}
