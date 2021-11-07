import { Model, Column, ColumnType } from './model';

export default class MutationsAR extends Model {
	
	public version = 1;
	public static table = 'mutations';
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
			name: 'table_name',
			primary: false,
			taintable: false,
			type: ColumnType.STRING,
		}, {
			name: 'original_value',
			primary: false,
			taintable: true,
			type: ColumnType.JSON,
		}, {
			name: 'modified_value',
			primary: false,
			taintable: true,
			type: ColumnType.JSON,
		}, 
	] as Column[];

	constructor() {
		super();
	}
}