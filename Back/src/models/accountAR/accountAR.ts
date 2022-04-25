import {
	Model,
	CollectionAR,
	PermissionsAR
} from '../';
import { PermissionType } from '../../../../Core/types/Models/Permissions';
import { cachableFn } from '../model/cachableFn';
import { AccountModel, AccountModelProps } from './accountModel';
import peppers from './helpers/peppers';

export const houseAccountId = 'houseaccount';

export class AccountAR extends AccountModel {

	public static Peppers = peppers;

	//relations
	public myFavourites = cachableFn<CollectionAR[]>(this, 'myFavouritesCache', async () => {
		const collections = await this.myCollections();
		const permissions = await this.myPermissions();
		const favouritePermissions = permissions.filter(p => p.favourite);

		return collections.filter(collection => !!favouritePermissions.find(p => p.collectionId === collection.id));
	});

	public myCollections = cachableFn<CollectionAR[]>(this, 'myCollectionsCache', async () => {
		const permissions = await this.myCollectionPermissions();
		const onlyMine = permissions.filter(p => p.permissionType === PermissionType.OWNER);

		return Promise.all<CollectionAR>(
			onlyMine.map(p => p.myCollection() as unknown as CollectionAR)
		);
	});

	public myPermissions = cachableFn<PermissionsAR[]>(this, 'myPermissionsCache', async () => {
		return Model.find<PermissionsAR>(PermissionsAR, { accountId: this.id, });
	});

	public myCollectionPermissions = cachableFn<PermissionsAR[]>(this, 'myCollectionPermissionsCache', async () => {
		const allPermissions = await this.myPermissions();
		return allPermissions.filter(permissions => !!permissions.collectionId);
	});

	public availableCollections = cachableFn<CollectionAR[]>(this, 'availableCollectionsCache', async () => {
		const results: CollectionAR[] = [
			...((await this.myCollections()) || []),
			// list of all externally linked collections
		];

		return results;
	});

	public myRecentCollections = cachableFn<CollectionAR[]>(this, 'myRecentCollectionsCache', async () => {
		const permissions = await this.myPermissions();
		const sorted = permissions.sort((a,b) => {
			return a.lastUpdated.getTime() - b.lastUpdated.getTime();
		});

		const trimmed = sorted.slice(0, 3);

		return Promise.all<CollectionAR>(
			trimmed.map(async p => await p.myCollection() as CollectionAR)
		);
	});

	public createDefaultEntries = async () => {
		// account that acts as system user
		const houseAccount = new AccountAR();

		await houseAccount.save<AccountAR>(null, [
			'id',
			'username',
			'password',
			'salt',
			'pepper',
			'mobile',
			'email',
		]);

		return;
	};

	public getCollectionById = async (id: string): Promise<CollectionAR|null> => {
		return (await this.availableCollections()).find(collection => collection.id === id) ?? null;
	};

	constructor(props?: AccountModelProps) {
		super(props);
	}
}