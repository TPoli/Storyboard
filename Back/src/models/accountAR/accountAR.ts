import {
	Model,
	CollectionAR,
	PermissionsAR
} from '../';
import { PermissionType } from '../../../../Core/types/Models/Permissions';
import { AccountModel, AccountModelProps } from './accountModel';
import peppers from './helpers/peppers';

export const houseAccountId = 'houseaccount';

export class AccountAR extends AccountModel {

	public static Peppers = peppers;

	//relations

	public myFavourites: () => Promise<CollectionAR[]> = async () => [];

	private collections: CollectionAR[]| null = null;
	public myCollections: () => Promise<CollectionAR[]> = async () => {
		if (this.collections === null) {
			const permissions = await this.myCollectionPermissions();
			const onlyMine = permissions.filter(p => p.permissionType === PermissionType.OWNER);
			this.collections = await Promise.all<CollectionAR>(
				onlyMine.map(p => p.myCollection() as unknown as CollectionAR)
			);
		}

		return this.collections;
	};

	private permissions: PermissionsAR[] | null = null;
	public myPermissions: () => Promise<PermissionsAR[]> = async () => {
		if (this.permissions === null) {
			this.permissions = await Model.find<PermissionsAR>(PermissionsAR, { accountId: this.id, });
		}
		return this.permissions;
	};

	private collectionPermissions: PermissionsAR[] | null = null;
	public myCollectionPermissions: () => Promise<PermissionsAR[]> = async () => {
		if (this.collectionPermissions === null) {
			const allPermissions = await this.myPermissions();
			this.collectionPermissions = allPermissions.filter(permissions => !!permissions.collectionId);
		}
		return this.collectionPermissions;
	};

	public availableCollections: () => Promise<CollectionAR[]> = async () => {
		
		const results: CollectionAR[] = [
			...((await this.myCollections()) || []),
			// list of all externally linked collections
		];

		return results;
	};

	private recentCollections: CollectionAR[]|null = null;
	public myRecentCollections: () => Promise<CollectionAR[]> = async () => {
		if (this.recentCollections === null) {
			const permissions = await this.myPermissions();
			console.log('permissions', permissions)
			const sorted = permissions.sort((a,b) => {
				return a.lastUpdated.getTime() - b.lastUpdated.getTime();
			});

			const trimmed = sorted.slice(0, 3);

			this.recentCollections = await Promise.all<CollectionAR>(
				trimmed.map(async p => await p.myCollection() as CollectionAR)
			);
		}

		return this.recentCollections;
	};

	public createDefaultEntries = async () => {
		// account that acts as system user
		const houseAccount = new AccountAR();

		await houseAccount.save(null, [
			'id',
			'username',
			'password',
			'salt',
			'pepper',
			'mobile',
			'email',
			'permissions',
		]);

		return;
	};

	public getCollectionById = async (id: string): Promise<CollectionAR|null> => {
		const availableCollection = (await this.availableCollections()).find(collection => collection.id === id);

		if (availableCollection) {
			return availableCollection;
		}

		return null;
	};

	constructor(props?: AccountModelProps) {
		super(props);
	}
}