import {
	AccountAR,
	CollectionAR
} from '../';
import { Column, ColumnType } from '../model';

const columns = [
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
		type: ColumnType.STRING,
		references: {
			model: new AccountAR().table,
			column: 'id',
		},
	}, {
		name: 'recentId1',
		primary: false,
		taintable: false,
		type: ColumnType.STRING,
		nullable: true,
		references: {
			model: new CollectionAR().table,
			column: 'id',
		},
	}, {
		name: 'recentId2',
		primary: false,
		taintable: false,
		type: ColumnType.STRING,
		nullable: true,
		references: {
			model: new CollectionAR().table,
			column: 'id',
		},
	}, {
		name: 'recentId3',
		primary: false,
		taintable: false,
		type: ColumnType.STRING,
		nullable: true,
		references: {
			model: new CollectionAR().table,
			column: 'id',
		},
	},
] as Column[];

export {columns};