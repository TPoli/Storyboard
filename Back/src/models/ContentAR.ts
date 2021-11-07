import { AccountAR } from './accountAR';
import { Model, Column, ColumnType } from './model';
import { Content, ContentData } from '../../../Core/types/Content';
import { Collection } from '../../../Core/types/Collection';
import CollectionAR from './CollectionAR';

export default class ContentAR extends Model implements Content {

	public id = -1;
	public name = '';
	public siblingOrder = 0;
	public parent: Collection|null = null;
	public data: ContentData = {};
	
	public version = 1;
	public table = 'content';
	public account: AccountAR|null = null;
	public columns = [
		{
			name: 'id',
			primary: true,
			taintable: false,
			type: ColumnType.INT,
			autoIncrement: true,
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
			nullable: false,
			references: {
				model: new CollectionAR().table,
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