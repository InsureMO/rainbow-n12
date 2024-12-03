import {ValidationFailedResponse} from '../interaction';

export enum ValidateLevel {
	ERROR = 'e', WARN = 'w', INFO = 'i'
}

export interface ValidateItem {
	code: string;
	message?: string;
	location?: string;
}

export interface LevelizedValidateItem extends ValidateItem {
	level: ValidateLevel;
}

export interface ValidationResultOpChain {
	message: (message: string) => {
		at: (location: string) => void;
	};
	at: (location: string) => void;
}

export interface IValidationResult {
	error(fragment: ValidateItem): void;
	error(code: ValidateItem['code']): ValidationResultOpChain;
	warn(fragment: ValidateItem): void;
	warn(code: ValidateItem['code']): ValidationResultOpChain;
	info(fragment: ValidateItem): void;
	info(code: ValidateItem['code']): ValidationResultOpChain;
	ok(): boolean;
	all(): Array<ValidateItem>;
	errors(): Array<ValidateItem>;
	warns(): Array<ValidateItem>;
	attentions(): Array<ValidateItem>;
	infos(): Array<ValidateItem>;
	toResponse(): ValidationFailedResponse;
}

export class ValidationResult implements IValidationResult {
	private readonly fragments: Array<LevelizedValidateItem> = [];
	private errorCount: number = 0;
	private warnCount: number = 0;
	private infoCount: number = 0;

	protected createChain(code: ValidateItem['code'], level: ValidateLevel, count: () => void): ValidationResultOpChain {
		return {
			message: (message: string) => {
				return {
					at: (location: string) => {
						this.fragments.push({code, message, location, level});
						count();
					}
				};
			},
			at: (location: string) => {
				this.fragments.push({code, location, level});
				count();
			}
		};
	}

	protected add(fragmentOrCode: ValidateItem | ValidateItem['code'], level: ValidateLevel, count: () => void) {
		if (typeof fragmentOrCode === 'string') {
			return this.createChain(fragmentOrCode, level, count);
		} else {
			this.fragments.push({...fragmentOrCode, level});
			count();
		}
	}

	public error(fragmentOrCode: ValidateItem | ValidateItem['code']) {
		return this.add(fragmentOrCode, ValidateLevel.ERROR, () => this.errorCount++);
	}

	public warn(fragmentOrCode: ValidateItem | ValidateItem['code']) {
		return this.add(fragmentOrCode, ValidateLevel.WARN, () => this.warnCount++);
	}

	public info(fragmentOrCode: ValidateItem | ValidateItem['code']) {
		return this.add(fragmentOrCode, ValidateLevel.INFO, () => this.infoCount++);
	}

	/**
	 * no error and warn
	 */
	public ok() {
		return this.errorCount === 0 && this.warnCount === 0;
	}

	public all(): Array<ValidateItem> {
		return [...this.fragments];
	}

	public errors(): Array<ValidateItem> {
		return this.fragments.filter(({level}) => level === ValidateLevel.ERROR);
	}

	public warns(): Array<ValidateItem> {
		return this.fragments.filter(({level}) => level === ValidateLevel.WARN);
	}

	/** errors and warns */
	public attentions(): Array<ValidateItem> {
		return this.fragments.filter(({level}) => level === ValidateLevel.ERROR || level === ValidateLevel.WARN);
	}

	public infos(): Array<ValidateItem> {
		return this.fragments.filter(({level}) => level === ValidateLevel.INFO);
	}

	public toResponse(): ValidationFailedResponse {
		return {code: 'R-00001', data: this.all()};
	}
}