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
		name: 'accountId',
		primary: true,
		taintable: false,
		type: ColumnType.STRING,
		references: {
			model: TableNames.ACCOUNT,
			column: 'id',
		},
	}, {
		name: 'route',
		primary: false,
		taintable: false,
		type: ColumnType.STRING,
		nullable: false,
	}, {
		name: 'ipAddress',
		primary: false,
		taintable: true,
		type: ColumnType.STRING,
		nullable: false,
	}, {
		name: 'params',
		primary: false,
		taintable: true,
		type: ColumnType.JSON,
		nullable: false,
	}, {
		name: 'response',
		primary: false,
		taintable: true,
		type: ColumnType.JSON,
	},
] as Column[];

export { columns };
