import { Column } from '../model';
import { ColumnType } from '../model/columnType';

const columns: Column[] = [
	{
		name: 'id',
		primary: true,
		taintable: false,
		type: ColumnType.INT,
		autoIncrement: true,
		nullable: false,
		unique: true,
	}, {
		name: 'username',
		primary: true,
		taintable: true,
		type: ColumnType.STRING,
		autoIncrement: false,
		nullable: false,
	}, {
		name: 'password',
		primary: false,
		taintable: true,
		type: ColumnType.TINY_TEXT,
		autoIncrement: false,
		nullable: false,
	}, {
		name: 'salt',
		primary: false,
		taintable: false,
		type: ColumnType.STRING,
		autoIncrement: false,
		nullable: false,
	}, {
		name: 'pepper',
		primary: false,
		taintable: false,
		type: ColumnType.STRING,
		autoIncrement: false,
		nullable: false,
	}, {
		name: 'permissions',
		primary: false,
		taintable: false,
		type: ColumnType.JSON,
		autoIncrement: false,
		nullable: false,
	}, {
		name: 'email',
		primary: false,
		taintable: true,
		type: ColumnType.STRING,
		autoIncrement: false,
		nullable: true,
		default: 'NULL',
	}, {
		name: 'mobile',
		primary: false,
		taintable: true,
		type: ColumnType.STRING,
		autoIncrement: false,
		nullable: true,
		default: 'NULL',
	},
];

export {
	columns
};
