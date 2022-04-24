import { Column, ColumnType } from '../model';

const columns = [
	{
		name: 'id',
		primary: true,
		taintable: false,
		type: ColumnType.STRING,
		autoIncrement: false,
		nullable: false,
		unique: true,
	}, {
		name: 'tableName',
		primary: false,
		taintable: false,
		type: ColumnType.STRING,
	}, {
		name: 'originalValue',
		primary: false,
		taintable: true,
		type: ColumnType.JSON,
	}, {
		name: 'modifiedValue',
		primary: false,
		taintable: true,
		type: ColumnType.JSON,
	}, 
] as Column[];

export { columns };
