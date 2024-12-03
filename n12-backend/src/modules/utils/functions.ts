import {Auditable, OptimisticLock, Pageable} from '@rainbow-n12/shared-model';
import {ValueOperator} from '@rainbow-n19/n1';
import {ServerConfig} from '../../server-envs';
import {TypeOrmPageable} from '../types';

/** assert given value to be of type T */
export const asT = <T>(value: any): T => value;
/** assert given function to be of type F */
export const asF = <F extends Function>(func: F): F => func;
export const notNull = <T>(value: T | null | undefined): value is T => value != null;

export const pageToTypeOrm = (page: Pageable): TypeOrmPageable => {
	let {pageNumber, pageSize} = page ?? {};
	pageSize = ValueOperator.of(pageSize).isInRange(ServerConfig.PAGE_SIZE_RANGE).toFixed0.toNumber.orUseDefault(ServerConfig.DEFAULT_PAGE_SIZE).value<number>();
	pageNumber = pageNumber ?? ValueOperator.of(pageNumber).isPositive.toFixed0.toNumber.orUseDefault(1).value<number>();
	return {offset: (pageNumber - 1) * pageSize, size: pageSize};
};

/**
 * delete fields which from {@link Auditable} or {@link OptimisticLock} for creation
 * @param entity
 */
export const deleteFieldsForCreation = <T extends Auditable | OptimisticLock>(entity: T): T => {
	delete (entity as OptimisticLock).version;
	delete (entity as Auditable).createdAt;
	delete (entity as Auditable).createdBy;
	delete (entity as Auditable).lastModifiedAt;
	delete (entity as Auditable).lastModifiedBy;
	return entity;
};