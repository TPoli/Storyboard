import { AccountAR } from './accountAR';
import CollectionAR from './CollectionAR';
import MutationsAR from './mutationsAR';
import { RecentCollectionsAR } from './recentCollectionsAR';
import TransactionsAR from './transactionsAR';
import { VersionsAR } from './versionsAR';

export type Schema = typeof VersionsAR | typeof MutationsAR | typeof AccountAR | typeof TransactionsAR | typeof CollectionAR | typeof RecentCollectionsAR;