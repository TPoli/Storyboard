import AccountAR from './accountAR';
import { Model, Column, ColumnType } from './model';
import { Content } from '../../../Core/types/Content';
import { Collection } from '../../../Core/types/Collection';

export default class CollectionAR extends Model implements Collection {

	public id = -1;
	public name = '';
	public siblingOrder = 0;
	public parent: Collection|null = null;
	public children: Collection[] = [];
	public content: Content[] = [];
	
	public version = 1;
	public table = 'collections';
	public account: AccountAR|null = null;
	public columns = [
		{
			name: 'id',
			primary: true,
			taintable: false,
			type: ColumnType.int,
			autoIncrement: true,
			nullable: false,
			unique: true,
		}, {
			name: 'account',
			primary: true,
			taintable: false,
			type: ColumnType.int,
			references: {
				model: new AccountAR().table,
				column: 'id',
			},
		}, {
			name: 'name',
			primary: false,
			taintable: true,
			type: ColumnType.string,
			nullable: false,
		}, {
			name: 'siblingOrder',
			primary: false,
			taintable: true,
			type: ColumnType.int,
			nullable: false,
		}, {
			name: 'parent',
			primary: false,
			taintable: true,
			type: ColumnType.int,
			nullable: true,
			references: {
				model: this.table,
				column: 'id',
			},
		},
	] as Column[];

	constructor() {
		super();
	}
}