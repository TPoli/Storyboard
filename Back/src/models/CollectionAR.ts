import {
	AccountAR,
	Model,
	Column,
	ColumnType,
	RecentCollectionsAR
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
				model: new AccountAR().table,
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
				model: this.table,
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

		const recentCollectionsMap = await req?.user?.recentCollections() ?? new RecentCollectionsAR();

		if (this.id === recentCollectionsMap.recentId1) {
			// most recently modified this collection, nothing to update
			return true;
		}

		const recentIds: string[] = [
			this.id,
		];
		if (recentCollectionsMap.recentId1 && !recentIds.includes(recentCollectionsMap.recentId1)) {
			recentIds.push(recentCollectionsMap.recentId1);
		}
		if (recentCollectionsMap.recentId2 && !recentIds.includes(recentCollectionsMap.recentId2)) {
			recentIds.push(recentCollectionsMap.recentId2);
		}
		if (recentCollectionsMap.recentId3 && !recentIds.includes(recentCollectionsMap.recentId3)) {
			recentIds.push(recentCollectionsMap.recentId3);
		}

		recentCollectionsMap.recentId1 = recentIds?.[0] ?? null;
		recentCollectionsMap.recentId2 = recentIds?.[1] ?? null;
		recentCollectionsMap.recentId3 = recentIds?.[2] ?? null;
		recentCollectionsMap.account = req.user.id;

		return await recentCollectionsMap.save(req, [
			'account',
			'recentId1',
			'recentId2',
			'recentId3',
		]);
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