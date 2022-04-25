import { Column, ColumnType } from "../model";

interface ColumnDefinitions {
	id: string;
	tableName: string;
	tableVersion: number;
};

type VersionsModelParams = Partial<ColumnDefinitions>;

type ColumnNames = keyof ColumnDefinitions;

type PermissionsColumn = Column & {
	name: ColumnNames;
};

const columns: PermissionsColumn[] = [
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
		autoIncrement: false,
		nullable: false,
	}, {
		name: 'tableVersion',
		primary: false,
		taintable: false,
		type: ColumnType.INT,
		autoIncrement: false,
		nullable: false,
	},
];

export {
	columns,
	VersionsModelParams,
	ColumnDefinitions,
};
