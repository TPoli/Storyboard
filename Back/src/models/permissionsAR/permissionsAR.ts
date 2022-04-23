import {
	Model,
	CollectionAR
} from '..';

import { modelRelations } from './relations';
import { columns } from './columns';
import { IPermissions } from '../../../../Core/types/Models';
import { PermissionType } from '../../../../Core/types/Models/Permissions';
import { LoggedInRequest } from '../../types/types';
import { TableNames } from '../tableNames';

export default class PermissionsAR extends Model implements IPermissions {
	
	// metadata
	public version = 1;
	public table = TableNames.PERMISSIONS;
	
	// columns
	public id;
	public favourite;
	public lastUpdated;
	public permissionType;
	public collectionId: string;
	public columns = columns;
	public accountId: string;

	//relations
	public collection: () => Promise<CollectionAR> = async () => new CollectionAR();
	public modelRelations = modelRelations;

	constructor(params?: any) {
		super();
		this.id = params?.id ?? '';
		this.favourite = params?.favourite ?? false;
		this.lastUpdated = new Date();
		this.permissionType = params?.permissionType ?? PermissionType.READ_ONLY;
		this.collectionId = params?.collectionId ?? '';
		this.accountId = params?.accountId ?? '';
	}

	public async beforeSave(req: LoggedInRequest | null): Promise<boolean> {
		if(!(await super.beforeSave(req))) {
			return false;
		}

		this.lastUpdated = new Date();

		return true;
	}
}