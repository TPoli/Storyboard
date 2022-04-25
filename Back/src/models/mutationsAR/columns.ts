import { Column, ColumnType } from '../model';

interface ColumnDefinitions {
	id: string;
	tableName: string;
	originalValue: Object;
	modifiedValue: Object;
};

type MutationsModelParams = Partial<ColumnDefinitions>;

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
		autoIncrement: false,
		type: ColumnType.STRING,
		nullable: false,
	}, {
		name: 'originalValue',
		primary: false,
		taintable: true,
		autoIncrement: false,
		type: ColumnType.JSON,
		nullable: false,
	}, {
		name: 'modifiedValue',
		primary: false,
		taintable: true,
		autoIncrement: false,
		type: ColumnType.JSON,
		nullable: false,
	}, 
];

export {
	columns,
	MutationsModelParams,
	ColumnDefinitions,
};
