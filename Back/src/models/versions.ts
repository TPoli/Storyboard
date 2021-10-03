import { Model, Column, ColumnType } from './model';

export default class Versions extends Model {
	
	public version = 1;
	public static table = 'versions';
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
			name: 'version',
			primary: false,
			taintable: false,
			type: ColumnType.int
		}
	] as Column[];

	constructor() {
		super();
	}
};