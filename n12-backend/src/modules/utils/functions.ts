import {Pageable} from '@rainbow-n12/shared-model';
import {ValueOperator} from '@rainbow-n19/n1';
import {ServerConfig} from '../../server-envs';
import {TypeOrmPageable} from '../types';

/** assert given value to be of type T */
export const asT = <T>(value: any): T => value;
/** assert given function to be of type F */
export const asF = <F extends Function>(func: F): F => func;

export const pageToTypeOrm = (page: Pageable): TypeOrmPageable => {
	let {pageNumber, pageSize} = page ?? {};
	pageSize = ValueOperator.of(pageSize).isInRange(ServerConfig.PAGE_SIZE_RANGE).toFixed0.toNumber.orUseDefault(ServerConfig.DEFAULT_PAGE_SIZE).value<number>();
	pageNumber = pageNumber ?? ValueOperator.of(pageNumber).isPositive.toFixed0.toNumber.orUseDefault(1).value<number>();
	return {offset: (pageNumber - 1) * pageSize, size: pageSize};
};
