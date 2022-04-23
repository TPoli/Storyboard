import { houseAccountId } from '.';
import { Model } from '../';
import { TableNames } from '../tableNames';
import { columns } from './columns';

export type AccountModelProps = {
	id?: string;
	username?: string;
	password?: string;
	salt?: string;
	pepper?: string;
	mobile?: string;
	email?: string;
};

export class AccountModel extends Model {
	
	// metadata
	public version = 1;
	public table = TableNames.ACCOUNT;

	// columns
	public username = '';
	public password = '';
	public salt = '';
	public pepper = '';
	public mobile: string|null = null;
	public email: string|null = null;
	public columns = columns;

	constructor(props?: AccountModelProps) {
		super();

		this.id = props?.id ?? houseAccountId;
		this.username = props?.username ?? houseAccountId;
		this.password = props?.password ?? ''; // empty string is a impossible input (UI), cant be logged into
		this.salt = props?.salt ?? '';
		this.pepper = props?.pepper ?? '';
		this.mobile = props?.mobile ?? '';
		this.email = props?.email ?? '';
	}
}