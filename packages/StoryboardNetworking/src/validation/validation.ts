export type ValidationCallback = (value: any, name: string, constraints?: any) => string|null;

const defaultStringConstraints = {
	minLength: 0,
	maxLength: 35,
};

export const booleanValidation: ValidationCallback = (value: any, name: string, constraints: any = defaultStringConstraints) => {

	if (typeof value !== 'boolean') {
		return `malformed parameter ${name}: "${value}"`;
	}

	return null;
};

export const uuidValidation: ValidationCallback = (value: string, name: string) => {
	const regexPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	
	if (!value.match(regexPattern)) {
		return `malformed parameter ${name}: "${value}"`;
	}

	return null;
};

export const stringValidation: ValidationCallback = (value: string, name: string, constraints: any = defaultStringConstraints) => {
	if (value.length > constraints.maxLength || value.length < constraints.minLength) {
		return `unexpected parameter length, Parameter ${name}: "${value}" not between min: ${constraints.minLength} and max: ${constraints.maxLength}`;
	}

	return null;
};

export const usernameValidation: ValidationCallback = (value: string, name: string) => {
	const errorMessage = stringValidation(value, name, {...defaultStringConstraints, minLength: 4,});
	if (errorMessage) {
		return errorMessage;
	}
	
	return null;
};

export const passwordValidation: ValidationCallback = (value: string, name: string) => {
	const errorMessage = stringValidation(value, name, {...defaultStringConstraints, minLength: 4,});
	if (errorMessage) {
		return errorMessage;
	}
	
	return null;
};