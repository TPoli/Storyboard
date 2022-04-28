import { CollectionAR, Model } from '..';
import { IPermissions } from '../../../../Core/types/Models';
import { cachableFn } from '../model/cachableFn';
import { PermissionsParams } from './types';
import { PermissionsModel } from './permissionsModel';

export default class PermissionsAR extends PermissionsModel implements IPermissions {
	//relations
	public myCollection = cachableFn<CollectionAR|null>(this, 'myCollectionCache', async () => {
		return Model.findOne<CollectionAR>(CollectionAR, { id: this.collectionId });
	});

	constructor(params?: PermissionsParams) {
		super(params);
	}
}