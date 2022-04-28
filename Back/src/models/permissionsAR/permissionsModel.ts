import { ColumnType, Model } from '..';

import { Columns, PermissionsParams } from './types';
import { IPermissions } from '../../../../Core/types/Models';
import { PermissionType } from '../../../../Core/types/Models/Permissions';
import { LoggedInRequest } from '../../types/types';
import { TableNames } from '../tableNames';
import { column } from '../model/column';

class PermissionsModel extends Model implements IPermissions, Columns {
	
	// metadata
	public version = 1;
	public table = TableNames.PERMISSIONS;
	
	// columns
	@column({ primary: true, unique: true })
	public id: string;
	@column({ taintable: true })
	public favourite: boolean;
	@column({ type: ColumnType.DATE_TIME })
	public lastUpdated: Date;
	@column({ taintable: true, type: ColumnType.STRING })
	public permissionType: PermissionType;
	@column({ primary: true, taintable: true, references: {
		model: TableNames.COLLECTIONS,
		column: 'id',
	}})
	public collectionId: string;
	@column({ primary: true, taintable: true, references: {
		model: TableNames.ACCOUNT,	
		column: 'id',
	}})
	public accountId: string;

	constructor(params?: PermissionsParams) {
		super();
		this.id = params?.id ?? '';
		this.favourite = params?.favourite ?? false;
		this.lastUpdated =  params?.lastUpdated ?? new Date();
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

export { PermissionsModel };
