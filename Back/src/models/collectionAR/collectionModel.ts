import {
	Model
} from '..';
import { LoggedInRequest } from '../../types/types';
import { PermissionsAR } from '../permissionsAR';
import { PermissionType } from '../../../../Core/types/Models/Permissions';
import { TableNames } from '../tableNames';
import { CollectionData, CollectionsModelParams, ColumnDefinitions, columns } from './columns';

class CollectionModel extends Model implements ColumnDefinitions {

	// metadata
	public version = 1;
	public table = TableNames.COLLECTIONS;

	// columns
	public id;
	public name;
	public siblingOrder;
	public parentId;
	public data: CollectionData;
	public columns = columns;

	public async afterSave(req: LoggedInRequest | null): Promise<boolean> {
		if(!(await super.afterSave(req))) {
			return false;
		}

		if (!req) {
			return false;
		}

		const user = req.user;

		const usersPermissions = await user.myPermissions();
		const existingPermissions = usersPermissions.find(permission => permission.collectionId = this.id);
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
			}
		} else {
			existingPermissions.lastUpdated = new Date();
			existingPermissions.save<PermissionsAR>(req, [
				'lastUpdated',
			])
		}

		return true;
	}

	constructor(params: CollectionsModelParams) {
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
