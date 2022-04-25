import { Column, ColumnType } from '../model';
import { TableNames } from '../tableNames';

interface ColumnDefinitions {
	id: string;
	accountId: string;
	route: string;
	ipAddress: string;
	params: Object;
	response: Object;
};

type TransactionsModelParams = Partial<ColumnDefinitions>;

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
		name: 'accountId',
		primary: true,
		taintable: false,
		type: ColumnType.STRING,
		references: {
			model: TableNames.ACCOUNT,
			column: 'id',
		},
		autoIncrement: false,
		nullable: false,
	}, {
		name: 'route',
		primary: false,
		taintable: false,
		type: ColumnType.STRING,
		autoIncrement: false,
		nullable: false,
	}, {
		name: 'ipAddress',
		primary: false,
		taintable: true,
		type: ColumnType.STRING,
		autoIncrement: false,
		nullable: false,
	}, {
		name: 'params',
		primary: false,
		taintable: true,
		type: ColumnType.JSON,
		autoIncrement: false,
		nullable: false,
	}, {
		name: 'response',
		primary: false,
		taintable: true,
		type: ColumnType.JSON,
		autoIncrement: false,
		nullable: false,
	},
];

export {
	columns,
	TransactionsModelParams,
	ColumnDefinitions,
};
