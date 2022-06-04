import { CollectionAR, Model } from '..';
import { IPermissions } from 'core';
import { cachableFn } from '../model/cachableFn';
import { PermissionsParams } from './types';
import { PermissionsModel } from './permissionsModel';

class PermissionsAR extends PermissionsModel implements IPermissions {
	//relations
	public myCollection = cachableFn<CollectionAR|null>(this, 'myCollectionCache', async () => {
		return Model.findOne<CollectionAR>(CollectionAR, { id: this.collectionId });
	});

	constructor(params?: PermissionsParams) {
		super(params);
	}
}

export {
	PermissionsAR,
}
