import { Model } from '../';
import { TableNames } from '../tableNames';
import { AccountModelProps, ColumnDefinitions, columns } from './columns';

export class AccountModel extends Model implements ColumnDefinitions {
	
	// metadata
	public version = 1;
	public table = TableNames.ACCOUNT;

	// columns
	public username;
	public password;
	public salt;
	public pepper;
	public mobile;
	public email;
	public columns = columns;

	constructor(props?: AccountModelProps) {
		super();

		this.id = props?.id ?? '';
		this.username = props?.username ?? '';
		this.password = props?.password ?? ''; // empty string is a impossible input (UI), cant be logged into
		this.salt = props?.salt ?? '';
		this.pepper = props?.pepper ?? '';
		this.mobile = props?.mobile ?? '';
		this.email = props?.email ?? '';
	}
}