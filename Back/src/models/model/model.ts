import * as mysql from 'mysql2';

import findOneFn from './findOne';
import { IModelRelation } from './modelRelation';
import { saveModelFn } from './save';
import { Column, IIndexable, SaveCallback } from './types';
import { addRelationship } from './index';
import { LoggedInRequest } from '../../types/types';

abstract class ModelBase implements IIndexable {
	public table = '';
	public abstract version: number;
	public columns: Column[] = [];
	public isNew = true;
	id: number|string = -1;

	public modelRelations: IModelRelation[] = [];
}

abstract class Model extends ModelBase {

	constructor() {
		super();
	}

	protected init = () => {
		this.modelRelations.forEach(relation => {
			addRelationship(this, relation);
		});
	}

	public static find<Type>(): Type|null {
		return null;
	}

	public findOne<Type extends Model>(params: Object, callback: (error: mysql.QueryError|null, result: Type|null) => void): void {
		findOneFn(this, params, callback);
	}

	public async save(callback: SaveCallback, req: LoggedInRequest|null, columns: string[] = []) {
		const saveResult = await saveModelFn(this, columns);
		callback(saveResult);
		this.afterSave(req);
	}

	public async afterSave(req: LoggedInRequest|null) {
		return; // not implemented yet
	}

	// use after save() if you need to access any auto generated data such as ID
	public async refresh(): Promise<void> {
		return; // not implemented yet
	}

	public createDefaultEntries = (callback: () => void) => {
		callback();
	};
}

export { Model, ModelBase };