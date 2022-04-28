import { Model } from '../model';
import { column } from '../model/column';
import { TableNames } from '../tableNames';
import { Columns, VersionsParams } from './types';

class VersionsModel extends Model implements Columns {
	
	// metadata
	public version = 1;
	public table = TableNames.VERSIONS;

	// columns
	@column({ primary: true, unique: true })
	public id: string;
	@column({})
	public tableName: string;
	@column({})
	public tableVersion: number;

	constructor(params: VersionsParams) {
		super();
		this.id = params.id ?? '';
		this.tableName = params.tableName ?? '';
		this.tableVersion = params.tableVersion ?? 0;
	}
}

export {
	VersionsModel,
};
