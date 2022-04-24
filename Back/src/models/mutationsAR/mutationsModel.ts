import { Model } from '../model';
import { TableNames } from '../tableNames';
import { columns } from './columns';

type MutationsModelParams = {
	id?: string;
	tableName?: string;
	originalValue?: Object;
	modifiedValue?: Object;
}

class MutationsModel extends Model implements MutationsModelParams {
	// metaData
	public version = 1;
	public table = TableNames.MUTATIONS;

	// columns
	public id: string;
	public tableName: string;
	public originalValue: Object;
	public modifiedValue: Object;
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
	MutationsModelParams
};
