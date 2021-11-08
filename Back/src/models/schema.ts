import {
	CollectionAR,
	TransactionsAR,
	RecentCollectionsAR,
	AccountAR,
	VersionsAR,
	MutationsAR
} from './';

export type Schema = typeof VersionsAR | typeof MutationsAR | typeof AccountAR | typeof TransactionsAR | typeof CollectionAR | typeof RecentCollectionsAR;