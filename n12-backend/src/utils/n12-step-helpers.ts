import {AnyValue, Undefinable} from '@rainbow-n12/shared-model';

const helpers = {
	isEmpty: (v?: AnyValue): boolean => v == null || (typeof v === 'string' && v.length === 0),
	isNotEmpty: (v?: AnyValue): boolean => (v ?? '') !== '',
	asUndefinedWhenEmpty: <T>(v?: T) => N12StepHelpers.isNotEmpty(v) ? v : (void 0),
	isBlank: (v?: AnyValue) => v == null || (typeof v === 'string' && v.trim().length === 0),
	isNotBlank: (v?: AnyValue) => v != null && `${v}`.trim().length !== 0,
	asUndefinedWhenBlank: <T>(v?: T) => N12StepHelpers.isNotBlank(v) ? v : (void 0),
	blankThen: (v: AnyValue, then: AnyValue | (() => AnyValue)) => N12StepHelpers.isBlank(v) ? (typeof then === 'function' ? then() : then) : v,
	isPrimitive: (v?: AnyValue) => v != null && ['string', 'number', 'boolean', 'symbol', 'bigint'].includes(typeof v),
	isNumber: (v?: AnyValue) => {
		if (N12StepHelpers.isBlank(v)) {
			return {test: false};
		}
		switch (typeof v) {
			case 'number':
				return {test: true, value: v};
			case 'string': {
				const n = Number(v);
				return Number.isNaN(n) ? {test: false} : {test: true, value: n};
			}
			default:
				return {test: false};
		}
	},
	assertNumber: (v: Undefinable<AnyValue>, assert: (v: number) => boolean) => {
		const result = N12StepHelpers.isNumber(v);
		if (!result.test) {
			return result;
		} else if (assert(result.value)) {
			return result;
		} else {
			return {test: false};
		}
	},
	isInteger: (v?: AnyValue) => N12StepHelpers.assertNumber(v, Number.isInteger),
	isNotInteger: (v?: AnyValue) => N12StepHelpers.assertNumber(v, (v: number) => !Number.isInteger(v)),
	isPositive: (v?: AnyValue) => N12StepHelpers.assertNumber(v, (v: number) => v > 0),
	isNotPositive: (v?: AnyValue) => N12StepHelpers.assertNumber(v, (v: number) => v <= 0),
	isNegative: (v?: AnyValue) => N12StepHelpers.assertNumber(v, (v: number) => v < 0),
	isNotNegative: (v?: AnyValue) => N12StepHelpers.assertNumber(v, (v: number) => v >= 0),
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	isFunction: (v?: AnyValue): v is Function => v != null && (typeof v === 'function'),
	base64Encode: (str: string): string => Buffer.from(str, 'utf-8').toString('base64'),
	base64Decode: (str: string): string => Buffer.from(str, 'base64').toString('utf-8'),
	noop: () => (void 0)
};

export const N12StepHelpers: Readonly<typeof helpers> = helpers;