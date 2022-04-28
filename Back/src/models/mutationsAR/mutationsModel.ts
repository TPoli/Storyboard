import { ColumnType, Model } from '../model';
import { column } from '../model/column';
import { TableNames } from '../tableNames';
import { Columns, MutationsParams } from './types';

class MutationsModel extends Model implements Columns {
	// metaData
	public version = 1;
	public table = TableNames.MUTATIONS;

	// columns
	@column({ primary: true, unique: true, })
	public id: string;
	@column({})
	public tableName: string;
	@column({ taintable: true, type: ColumnType.JSON })
	public originalValue: Object;
	@column({ taintable: true, type: ColumnType.JSON })
	public modifiedValue: Object;

	constructor(params: MutationsParams) {
		super();
		this.id = params.id ?? '';
		this.tableName = params.tableName ?? '';
		this.originalValue = params.originalValue ?? {};
		this.modifiedValue = params.modifiedValue ?? {};
	}
}

export {
	MutationsModel,
};
