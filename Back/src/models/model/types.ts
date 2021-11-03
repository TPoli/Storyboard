
export enum ColumnType {
	'int' = 'INT',
	'string' = 'VARCHAR(45)',
	'tinytext' = 'TINYTEXT',
	'json' = 'JSON',
	'bool' = 'BOOLEAN',
	'datetime' = 'DATETIME'
}

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
		model: string,
		column: string
	};
};

export interface IIndexable {
	[key: string]: any;
}

export type SaveCallback = (success: boolean) => void;
export type RefreshCallback = () => void;