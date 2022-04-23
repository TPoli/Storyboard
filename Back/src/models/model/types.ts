import { TableNames } from '../tableNames';
import { ColumnType } from './columnType';

export type Column = {
	name: string;
	type: ColumnType;
	taintable: boolean;
	primary: boolean;
	nullable: boolean;
	autoIncrement: boolean;
	default?: 'NULL';
	unique?: true;
	references?: {
		model: TableNames,
		column: string
	};
};

export interface IIndexable {
	[key: string]: any;
}

export type RefreshCallback = () => void;