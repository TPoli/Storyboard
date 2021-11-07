import { AccountAR } from './accountAR';
import CollectionAR from './CollectionAR';

export type ActiveRecords = AccountAR | CollectionAR;

export const createModel = (modelName: string): ActiveRecords | null => {
	switch (modelName) {
		case 'accounts':
			return new AccountAR();
		case 'collections':
			return new CollectionAR();
		default:
			return null;
	}
};