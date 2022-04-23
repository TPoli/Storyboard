import {
	CollectionAR,
	AccountAR,
	PermissionsAR
} from './';

export type ActiveRecords = AccountAR | CollectionAR | PermissionsAR;

export const createModel = (modelName: string): ActiveRecords | null => {
	let model: ActiveRecords | null = null;
	switch (modelName) {
		case 'accounts':
			model = new AccountAR();
			break;
		case 'collections':
			model = new CollectionAR();
			break;
		case 'permissions':
			model = new PermissionsAR();
		default:
			return null;
	}

	if (model) {
		model.init();
	}
	return model;
};