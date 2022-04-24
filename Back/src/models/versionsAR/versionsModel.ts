import { Model, Column, ColumnType } from '../model';
import { TableNames } from '../tableNames';

type VersionsModelParams = {
	id?: string;
	tableName?: string;
	tableVersion?: number;
};

class VersionsModel extends Model {
	
	// metadata
	public version = 1;
	public table = TableNames.VERSIONS;

	// columns
	public id;
	public tableName;
	public tableVersion;

	public columns = [
		{
			name: 'id',
			primary: true,
			taintable: false,
			type: ColumnType.INT,
			autoIncrement: true,
			nullable: false,
			unique: true,
		}, {
			name: 'tableName',
			primary: false,
			taintable: false,
			type: ColumnType.STRING,
		}, {
			name: 'tableVersion',
			primary: false,
			taintable: false,
			type: ColumnType.INT,
		},
	] as Column[];

	constructor(params: VersionsModelParams) {
		super();
		this.id = params.id ?? '';
		this.tableName = params.tableName ?? '';
		this.tableVersion = params.tableVersion ?? 0;
	}
}

export {
	VersionsModel,
	VersionsModelParams
}
