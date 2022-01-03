import {
	CollectionAR,
	Model,
	Column,
	IModelRelation,
	AccountAR
} from '..';
import { modelRelations } from './relations';
import { columns } from './columns';

export class FavouritesAR extends Model {
	// metadata
	public version = 1;
	public table = 'favourites';

	// columns
	public id = '';
	public accountId: number|null = null;
	public collectionId: string|null = null;
	public columns: Column[] = columns;

	// relations
	public account: () => Promise<AccountAR|null> = async () => null;
	public collection: () => Promise<CollectionAR|null> = async () => null;
	public modelRelations: IModelRelation[] = modelRelations;

	constructor() {
		super();
	}
}