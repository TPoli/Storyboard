import { Column, ColumnType } from '../model';
import { TableNames } from '../tableNames';

type CollectionData = {
	content: string;
};

interface ColumnDefinitions {
	id: string;
	name: string;
	siblingOrder: number;
	parentId: string|null;
	data: CollectionData;
};

type CollectionsModelParams = Partial<ColumnDefinitions>;

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
		name: 'name',
		primary: false,
		taintable: true,
		autoIncrement: false,
		type: ColumnType.STRING,
		nullable: false,
	}, {
		name: 'siblingOrder',
		primary: false,
		taintable: true,
		autoIncrement: false,
		type: ColumnType.INT,
		nullable: false,
	}, {
		name: 'parentId',
		primary: false,
		taintable: true,
		autoIncrement: false,
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
		autoIncrement: false,
		type: ColumnType.JSON,
		nullable: false,
	},
];

export {
	columns,
	CollectionsModelParams,
	ColumnDefinitions,
};
