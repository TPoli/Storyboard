import {
	CollectionAR,
	Model,
	Column,
	IModelRelation
} from '../';
import { modelRelations } from './relations';
import { columns } from './columns';

export class RecentCollectionsAR extends Model {
	// metadata
	public version = 1;
	public table = 'recentCollections';

	// columns
	public id = '';
	public account: number|null = null;
	public recentId1 = '';
	public recentId2 = '';
	public recentId3 = '';
	public columns: Column[] = columns;

	// relations
	public recent1: CollectionAR|null = null;
	public recent2: CollectionAR|null = null;
	public recent3: CollectionAR|null = null;
	public modelRelations: IModelRelation[] = modelRelations;

	constructor() {
		super();
	}
}