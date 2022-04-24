import { Column, ColumnType } from '../model';
import { TableNames } from '../tableNames';

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
		name: 'parentId',
		primary: false,
		taintable: true,
		type: ColumnType.STRING,
		nullable: true,
		references: {
			model: TableNames.COLLECTIONS,
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

export { columns };
