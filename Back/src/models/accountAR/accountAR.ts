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
	
	public version = 1;
	public table = 'account';
	public columns = columns;

	public id = -1;
	public username = '';
	public password = '';
	public salt = '';
	public pepper = '';
	public mobile: string|null = null;
	public email: string|null = null;
	public permissions: Object = {};
	public myCollections: CollectionAR[] = [];
	public recentCollectionsMap: RecentCollectionsAR|null = null;
	public recentCollections: CollectionAR[] = [];

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
			name: 'recentCollectionsMap',
			childColumn: 'account',
			parentColumn: 'id',
			relationType: RelationType.ONE_TO_ONE,
		},
	];

	public static Peppers = () => {
		return peppers;
	}

	constructor() {
		super();
		this.init();
	}

	public createDefaultEntries = async (callback: () => void) => {
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

		callback();
	};
}