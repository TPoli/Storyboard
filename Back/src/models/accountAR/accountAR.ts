import CollectionAR from '../CollectionAR';
import { IModelRelation, Model, SaveCallback } from '../model';
import { RelationType } from '../model/modelRelation';
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

	public modelRelations: IModelRelation[] = [
		{
			table: 'collections',
			join: 'left',
			name: 'myCollections',
			childColumn: 'account',
			parentColumn: 'id',
			relationType: RelationType.ONE_TO_MANY,
		},
	];

	public static Peppers = () => {
		return peppers;
	}

	constructor() {
		super();
		this.init();
	}

	public createDefaultEntries = (callback: () => void) => {
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

		const saveCallback: SaveCallback = (success: boolean) => {
			callback();
		};

		houseAccount.save(saveCallback, [
			'id',
			'username',
			'password',
			'salt',
			'pepper',
			'mobile',
			'email',
			'permissions',
		]);
	};
}