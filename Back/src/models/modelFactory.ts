import {
	CollectionAR,
	AccountAR,
	RecentCollectionsAR
} from './';

export type ActiveRecords = AccountAR | CollectionAR | RecentCollectionsAR;

export const createModel = (modelName: string): ActiveRecords | null => {
	switch (modelName) {
		case 'accounts':
			return new AccountAR();
		case 'collections':
			return new CollectionAR();
		case 'recentCollections':
			return new RecentCollectionsAR();
		default:
			return null;
	}
};