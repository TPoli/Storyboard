
export type ValidationCallback = (value: any, name: string, constraints?: any) => string|null;

const defaultStringConstraints = {
	minLength: 0,
	maxLength: 35
};

export const stringValidation: ValidationCallback = (value: string, name: string, constraints: any = defaultStringConstraints) => {
	if (value.length > constraints.maxLength || value.length < constraints.minLength) {
		return `unexpected parameter length, Parameter ${name}: "${value}" not between min: ${constraints.minLength} and max: ${constraints.maxLength}`;
	}

	return null;
};

export const usernameValidation: ValidationCallback = (value: string, name: string) => {
	let errorMessage = stringValidation(value, name, {...defaultStringConstraints, minLength: 4});
	if (errorMessage) {
		return errorMessage;
	}
	
	return null;
};

export const passwordValidation: ValidationCallback = (value: string, name: string) => {
	let errorMessage = stringValidation(value, name, {...defaultStringConstraints, minLength: 4});
	if (errorMessage) {
		return errorMessage;
	}
	
	return null;
};