import {
	CollectionAR,
	AccountAR,
	RecentCollectionsAR
} from './';

export type ActiveRecords = AccountAR | CollectionAR | RecentCollectionsAR;

export const createModel = (modelName: string): ActiveRecords | null => {
	let model: ActiveRecords | null = null;
	switch (modelName) {
		case 'accounts':
			model = new AccountAR();
			break;
		case 'collections':
			model = new CollectionAR();
			break;
		case 'recentCollections':
			model = new RecentCollectionsAR();
			break;
		default:
			return null;
	}

	if (model) {
		model.init();
	}
	return model;
};