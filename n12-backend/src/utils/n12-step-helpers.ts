const helpers = {
	base64Encode: (str: string): string => Buffer.from(str, 'utf-8').toString('base64'),
	base64Decode: (str: string): string => Buffer.from(str, 'base64').toString('utf-8')
};

export const N12StepHelpers: Readonly<typeof helpers> = helpers;
