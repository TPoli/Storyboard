import { AccountAR } from './accountAR';
import { Model, Column, ColumnType } from './model';
import { Content } from '../../../Core/types/Content';
import { Collection } from '../../../Core/types/Collection';

export default class CollectionAR extends Model implements Collection {

	public id = '';
	public name = '';
	public siblingOrder = 0;
	public parent: Collection|null = null;
	public children: Collection[] = [];
	public content: Content[] = [];
	
	public version = 1;
	public table = 'collections';
	public account: number|null = null;
	public data: {
		content: string,
	}| null = null;
	public columns = [
		{
			name: 'id',
			primary: true,
			taintable: false,
			type: ColumnType.STRING,
			autoIncrement: false,
			nullable: false,
			unique: true,
		}, {
			name: 'account',
			primary: true,
			taintable: false,
			type: ColumnType.INT,
			references: {
				model: new AccountAR().table,
				column: 'id',
			},
		}, {
			name: 'name',
			primary: false,
			taintable: true,
			type: ColumnType.STRING,
			nullable: false,
		}, {
			name: 'siblingOrder',
			primary: false,
			taintable: true,
			type: ColumnType.INT,
			nullable: false,
		}, {
			name: 'parent',
			primary: false,
			taintable: true,
			type: ColumnType.INT,
			nullable: true,
			references: {
				model: this.table,
				column: 'id',
			},
		}, {
			name: 'data',
			primary: false,
			taintable: true,
			type: ColumnType.JSON,
			nullable: false,
		},
	] as Column[];

	constructor() {
		super();
	}
}