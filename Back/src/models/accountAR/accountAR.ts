import CollectionAR from '../CollectionAR';
import { Model, Column, ColumnType, SaveCallback } from '../model';
import peppers from './peppers'

export default class AccountAR extends Model {
	
	public version = 1;
	public table = 'account';
	public columns: Column[] = [
		{
			name: 'id',
			primary: true,
			taintable: false,
			type: ColumnType.int,
			autoIncrement: true,
			nullable: false,
			unique: true,
		}, {
			name: 'username',
			primary: true,
			taintable: true,
			type: ColumnType.string,
			autoIncrement: false,
			nullable: false,
		}, {
			name: 'password',
			primary: false,
			taintable: true,
			type: ColumnType.tinytext,
			autoIncrement: false,
			nullable: false,
		}, {
			name: 'salt',
			primary: false,
			taintable: false,
			type: ColumnType.string,
			autoIncrement: false,
			nullable: false,
		}, {
			name: 'pepper',
			primary: false,
			taintable: false,
			type: ColumnType.string,
			autoIncrement: false,
			nullable: false,
		}, {
			name: 'permissions',
			primary: false,
			taintable: false,
			type: ColumnType.json,
			autoIncrement: false,
			nullable: false,
		}, {
			name: 'email',
			primary: false,
			taintable: true,
			type: ColumnType.string,
			autoIncrement: false,
			nullable: true,
			default: 'NULL',
		}, {
			name: 'mobile',
			primary: false,
			taintable: true,
			type: ColumnType.string,
			autoIncrement: false,
			nullable: true,
			default: 'NULL',
		},
	];

	public id = -1;
	public username = '';
	public password = '';
	public salt = '';
	public pepper = '';
	public mobile: string|null = null;
	public email: string|null = null;
	public permissions: Object = {};

	public static Peppers = () => {
		return peppers;
	}

	constructor() {
		super();
	}

	public createDefaultEntries = (callback: () => void) => {
		// account that acts as system user
		const houseAccount = new AccountAR();
		houseAccount.id=0;
		houseAccount.username='houseaccount';
		houseAccount.password=''; // empty string is a impossable input, cant be logged into
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