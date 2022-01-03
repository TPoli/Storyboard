import {
	CollectionAR,
	AccountAR,
	RecentCollectionsAR,
	FavouritesAR
} from './';

export type ActiveRecords = AccountAR | CollectionAR | RecentCollectionsAR | FavouritesAR;

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
		case 'favourites':
			model = new FavouritesAR();
			break;
		default:
			return null;
	}

	if (model) {
		model.init();
	}
	return model;
};