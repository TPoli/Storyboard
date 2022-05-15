import { ColumnType, Model } from '../';
import { TableNames } from '../tableNames';
import { AccountProps, Columns } from './types';
import { column } from '../model/column';

export class AccountModel extends Model implements Columns {
	
	// metadata
	public version = 1;
	public table = TableNames.ACCOUNT;

	// columns
	@column({ primary: true, unique: true })
	public id: string;
	@column({ primary: true, taintable: true })
	public username: string;
	@column({ taintable: true, type: ColumnType.TINY_TEXT })
	public password: string;
	@column({})
	public salt: string;
	@column({})
	public pepper: string;
	@column({ taintable: true, nullable: true, default: 'NULL' })
	public mobile: string;
	@column({ taintable: true, nullable: true, default: 'NULL' })
	public email: string;

	constructor(props?: AccountProps) {
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