import {DefaultSteps, TypeOrmBySQLPipelineStepBuilderOptions} from '@rainbow-o23/n4';
import {TypeOrmStepDataSourceBuilder, TypeOrmStepTransactionAndSqlBuilder} from './typeorm';

export class TypeOrmBulkSaveBySQLStepBuilder<I, O> extends TypeOrmStepDataSourceBuilder<TypeOrmBySQLPipelineStepBuilderOptions, I, O, TypeOrmStepTransactionAndSqlBuilder<I, O>> {
	public constructor(name: string) {
		super({name, use: DefaultSteps.TYPEORM_BULK_SAVE_BY_SQL});
	}

	protected createNextBuilder(): TypeOrmStepTransactionAndSqlBuilder<I, O> {
		return new TypeOrmStepTransactionAndSqlBuilder<I, O>(this.def);
	}
}
