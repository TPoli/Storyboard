import { Model } from '../model';
import { TableNames } from '../tableNames';
import { ColumnDefinitions, columns, MutationsModelParams } from './columns';

class MutationsModel extends Model implements ColumnDefinitions {
	// metaData
	public version = 1;
	public table = TableNames.MUTATIONS;

	// columns
	public id;
	public tableName;
	public originalValue;
	public modifiedValue;
	public columns = columns;

	constructor(params: MutationsModelParams) {
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
