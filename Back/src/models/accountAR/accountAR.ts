import {
	IModelRelation,
	Model,
	CollectionAR,
	RelationType,
	RecentCollectionsAR
} from '../';
import { columns } from './columns';
import peppers from './peppers';

export default class AccountAR extends Model {
	
	// metadata
	public version = 1;
	public table = 'account';
	
	// columns
	public id = -1;
	public username = '';
	public password = '';
	public salt = '';
	public pepper = '';
	public mobile: string|null = null;
	public email: string|null = null;
	public permissions: Object = {};
	public columns = columns;

	//relations
	public myCollections: () => Promise<CollectionAR[]> = async () => [];
	public availableCollections: () => Promise<CollectionAR[]> = async () => {
		
		const results: CollectionAR[] = [
			...(await this.myCollections()),
			// list of all externally linked collections
		];

		return results;
	};
	public recentCollections: () => Promise<RecentCollectionsAR|null> = async () => null;

	public modelRelations: IModelRelation[] = [
		{
			table: 'collections',
			join: 'left',
			name: 'myCollections',
			childColumn: 'account',
			parentColumn: 'id',
			relationType: RelationType.ONE_TO_MANY,
		}, {
			table: 'recentCollections',
			join: 'left',
			name: 'recentCollections',
			childColumn: 'account',
			parentColumn: 'id',
			relationType: RelationType.ONE_TO_ONE,
		},
	];

	public static Peppers = peppers;

	constructor() {
		super();
	}

	public createDefaultEntries = async () => {
		// account that acts as system user
		const houseAccount = new AccountAR();
		houseAccount.id=0;
		houseAccount.username='houseaccount';
		houseAccount.password=''; // empty string is a impossible input, cant be logged into
		houseAccount.salt='';
		houseAccount.pepper='';
		houseAccount.mobile='';
		houseAccount.email='';
		houseAccount.permissions={};

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
}