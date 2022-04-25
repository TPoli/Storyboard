import { CollectionAR } from '..';
import { IPermissions } from '../../../../Core/types/Models';
import { cachableFn } from '../model/cachableFn';
import { PermissionsModelParams } from './columns';
import { PermissionsModel } from './permissionsModel';

export default class PermissionsAR extends PermissionsModel implements IPermissions {
	//relations
	public myCollection = cachableFn<CollectionAR|null>(this, 'myCollectionCache', async () => {
		return (new CollectionAR({})).findOne<CollectionAR>({ id: this.collectionId, });
	});

	constructor(params?: PermissionsModelParams) {
		super(params);
	}
}