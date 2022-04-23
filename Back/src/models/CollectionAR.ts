import {
	Model,
	Column,
	ColumnType
} from './';
import { Collection } from '../../../Core/types/Collection';
import { LoggedInRequest } from '../types/types';
import { PermissionsAR } from './permissionsAR';
import { PermissionType } from '../../../Core/types/Models/Permissions';
import { TableNames } from './tableNames';

export class CollectionAR extends Model implements Collection {

	public name = '';
	public siblingOrder = 0;
	public parent: string|null = null;
	public children: string[] = [];
	
	public version = 1;
	public table = TableNames.COLLECTIONS;
	public account: string|null = null;
	public data: {
		content: string,
	}| null = null;
	public columns = [
		{
			name: 'id',
			primary: true,
			taintable: false,
			type: ColumnType.STRING,
			autoIncrement: false,
			nullable: false,
			unique: true,
		}, {
			name: 'account',
			primary: true,
			taintable: false,
			type: ColumnType.STRING,
			references: {
				model: TableNames.ACCOUNT,
				column: 'id',
			},
		}, {
			name: 'name',
			primary: false,
			taintable: true,
			type: ColumnType.STRING,
			nullable: false,
		}, {
			name: 'siblingOrder',
			primary: false,
			taintable: true,
			type: ColumnType.INT,
			nullable: false,
		}, {
			name: 'parent',
			primary: false,
			taintable: true,
			type: ColumnType.STRING,
			nullable: true,
			references: {
				model: TableNames.COLLECTIONS,
				column: 'id',
			},
		}, {
			name: 'data',
			primary: false,
			taintable: true,
			type: ColumnType.JSON,
			nullable: false,
		},
	] as Column[];

	constructor() {
		super();
	}

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
			const permissionsCreated = await newPermissions.save(req, [
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
			existingPermissions.save(req, [
				'lastUpdated',
			])
		}

		return true;
	}

	/**
	 * recursive helper function to test if provided array contains this collections parent, grandparent etc.
	 * 
	 * @param collections 
	 * @param allCollections use this if multiple checks are needed to prevent wasted queries
	 */
	public async ListContainsParent(collections: CollectionAR[], allCollections: CollectionAR[] = []): Promise<{
		containsParent: boolean,
		allCollections: CollectionAR[],
	}> {
		if (!this.parent) {
			return {
				containsParent: false,
				allCollections,
			};
		}

		const directMatch = collections.find(collection => {
			return collection.id === this.parent;
		});

		if (directMatch) {
			return {
				containsParent: true,
				allCollections,
			};
		}

		let parent: CollectionAR|undefined|null = allCollections.find(collection => {
			return collection.id === this.parent;
		});

		if (!parent) {
			parent = await (new CollectionAR).findOne({id: this.parent,}) as CollectionAR|null;
			if (parent) {
				allCollections.push(parent);
			}
		}

		return parent?.ListContainsParent(collections, allCollections) ?? {
			containsParent: false,
			allCollections,
		};
	}
}