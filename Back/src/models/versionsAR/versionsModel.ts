import { Model } from '../model';
import { TableNames } from '../tableNames';
import { ColumnDefinitions, columns, VersionsModelParams } from './columns';

class VersionsModel extends Model implements ColumnDefinitions {
	
	// metadata
	public version = 1;
	public table = TableNames.VERSIONS;

	// columns
	public id;
	public tableName;
	public tableVersion;

	public columns = columns;

	constructor(params: VersionsModelParams) {
		super();
		this.id = params.id ?? '';
		this.tableName = params.tableName ?? '';
		this.tableVersion = params.tableVersion ?? 0;
	}
}

export {
	VersionsModel,
};
