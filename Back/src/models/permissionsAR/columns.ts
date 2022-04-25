import { PermissionType } from '../../../../Core/types/Models/Permissions';
import { Column } from '../model';
import { ColumnType } from '../model/columnType';
import { TableNames } from '../tableNames';

interface ColumnDefinitions {
	id: string;
	favourite: boolean;
	lastUpdated: Date;
	permissionType: PermissionType;
	collectionId: string;
	accountId: string;
}

type PermissionsModelProps = Partial<ColumnDefinitions>;

type ColumnNames = keyof ColumnDefinitions;

type PermissionsColumn = Column & {
	name: ColumnNames;
}

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
		taintable: true,
		type: ColumnType.STRING,
		autoIncrement: false,
		nullable: false,
		references: {
			model: TableNames.ACCOUNT,
			column: 'id',
		},
	}, {
		name: 'collectionId',
		primary: true,
		taintable: true,
		type: ColumnType.STRING,
		autoIncrement: false,
		nullable: false,
		references: {
			model: TableNames.COLLECTIONS,
			column: 'id',
		},
	}, {
		name: 'permissionType',
		primary: false,
		taintable: true,
		type: ColumnType.STRING,
		autoIncrement: false,
		nullable: false,
	}, {
		name: 'favourite',
		primary: false,
		taintable: true,
		type: ColumnType.BOOL,
		autoIncrement: false,
		nullable: false,
	}, {
		name: 'lastUpdated',
		primary: false,
		taintable: false,
		type: ColumnType.DATE_TIME,
		autoIncrement: false,
		nullable: false,
	},
];

export {
	columns,
	ColumnNames,
	ColumnDefinitions,
	PermissionsModelProps
};
