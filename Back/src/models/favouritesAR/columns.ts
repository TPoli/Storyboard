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
	}, {
		name: 'accountId',
		primary: true,
		taintable: false,
		type: ColumnType.INT,
		references: {
			model: new AccountAR().table,
			column: 'id',
		},
	}, {
		name: 'collectionId',
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