import { Model, Column, ColumnType } from './model';

export default class MutationsAR extends Model {
	
	public version = 1;
	public static table = 'mutations';
	public columns = [
		{
			name: 'id',
			primary: true,
			taintable: false,
			type: ColumnType.int,
			autoIncrement: true,
			nullable: false,
			unique: true
		}, {
			name: 'table_name',
			primary: false,
			taintable: false,
			type: ColumnType.string
		}, {
			name: 'original_value',
			primary: false,
			taintable: true,
			type: ColumnType.json
		}, {
			name: 'modified_value',
			primary: false,
			taintable: true,
			type: ColumnType.json
		}, 
	] as Column[];

	constructor() {
		super();
	}
};