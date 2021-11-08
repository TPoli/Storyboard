import CollectionAR from '../CollectionAR';
import { Model, Column, IModelRelation } from '../model';
import { columns } from './columns';
import { modelRelations } from './relations';

export class RecentCollectionsAR extends Model {
	// metadata
	public version = 1;

	// columns
	public id = '';
	public table = 'recentCollections';
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