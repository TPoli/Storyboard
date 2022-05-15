import {
	ColumnType,
	Model,
} from '..';
import { LoggedInRequest } from '../../types/types';
import { PermissionsAR } from '../permissionsAR';
import { PermissionType } from '../../../../Core/types/Models/Permissions';
import { TableNames } from '../tableNames';
import { CollectionData, CollectionsParams, Columns } from './types';
import { column } from '../model/column';

class CollectionModel extends Model implements Columns {

	// metadata
	public version = 1;
	public table = TableNames.COLLECTIONS;

	// columns
	@column({ primary: true, unique: true })
	public id: string;
	@column({ taintable: true })
	public name: string;
	@column({ taintable: true })
	public siblingOrder: number;
	@column({ taintable: true, nullable: true, type: ColumnType.STRING, references: {
		model: TableNames.COLLECTIONS,
		column: 'id',
	}})
	public parentId: string | null;
	
	@column({ taintable: true, type: ColumnType.JSON })
	public data: CollectionData;

	public async afterSave(req: LoggedInRequest | null): Promise<boolean> {
		if(!(await super.afterSave(req))) {
			return false;
		}

		if (!req) {
			return false;
		}

		const user = req.user;

		const usersPermissions = await user.myPermissions();
		const existingPermissions = usersPermissions.find(permission => permission.collectionId === this.id);
		if (!existingPermissions) {
			const newPermissions = new PermissionsAR({
				collectionId: this.id,
				permissionType: PermissionType.OWNER,
				accountId: user.id,
			});
			const permissionsCreated = await newPermissions.save<PermissionsAR>(req, [
				'id',
				'favourite',
				'lastUpdated',
				'permissionType',
				'collectionId',
				'accountId',
			]);

			if (!permissionsCreated) {
				// TODO rollback
				console.log('failed to create new permissions')
			}
		} else {
			existingPermissions.lastUpdated = new Date();
			existingPermissions.save<PermissionsAR>(req, [
				'lastUpdated',
			])
		}

		return true;
	}

	constructor(params: CollectionsParams) {
		super();
		this.id = params.id ?? '';
		this.name = params.name ?? 'New Collection';
		this.siblingOrder = params.siblingOrder ?? 0;
		this.parentId = params.parentId ?? null;
		this.data = params.data ?? {
			content: '',
		};
	}
}

export {
	CollectionModel,
};
