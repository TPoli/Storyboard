import {
	CollectionAR,
	Model,
	Column,
	IModelRelation
} from '../';
import { modelRelations } from './relations';
import { columns } from './columns';

const placeholderRelation = async (): Promise<CollectionAR|null> => { return null };

export class RecentCollectionsAR extends Model {
	// metadata
	public version = 1;
	public table = 'recentCollections';

	// columns
	public id = -1;
	public account: number|null = null;
	public recentId1: string|null = null;
	public recentId2: string|null = null;
	public recentId3: string|null = null;
	public columns: Column[] = columns;

	// relations
	public recent1: () => Promise<CollectionAR|null> = placeholderRelation;
	public recent2: () => Promise<CollectionAR|null> = placeholderRelation;
	public recent3: () => Promise<CollectionAR|null> = placeholderRelation;
	public modelRelations: IModelRelation[] = modelRelations;

	// other
	public collections = async (): Promise<CollectionAR[]> => {
		return [
			await this.recent1(),
			await this.recent2(),
			await this.recent3(),
		].filter(c => c !== null) as CollectionAR[];
	};

	constructor() {
		super();
	}
}