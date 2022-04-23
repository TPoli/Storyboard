import {
	CollectionAR,
	TransactionsAR,
	AccountAR,
	VersionsAR,
	MutationsAR,
	PermissionsAR
} from './';

export type Schema = typeof VersionsAR | typeof MutationsAR | typeof AccountAR | typeof TransactionsAR | typeof CollectionAR | typeof PermissionsAR;