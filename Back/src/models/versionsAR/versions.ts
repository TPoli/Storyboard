import { Model, Column, ColumnType } from '../model';

export class VersionsAR extends Model {
	
	public version = 1;
	public static table = 'versions';
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
			name: 'version',
			primary: false,
			taintable: false,
			type: ColumnType.INT,
		},
	] as Column[];

	constructor() {
		super();
	}
}