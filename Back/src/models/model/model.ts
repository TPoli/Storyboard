import * as mysql from 'mysql2';
import findOneFn from './findOne';
import { IModelRelation } from './modelRelation';
import {saveModelFn} from './save';
import { Column, IIndexable, RefreshCallback, SaveCallback } from './types';
import { addRelationship } from './index';

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

	public async save(callback: SaveCallback, columns: string[] = []) {
		callback(await saveModelFn(this, columns));
	}

	// use after save() if you need to access any auto generated data such as ID
	public refresh(callback: RefreshCallback): void {
		callback();
	}

	public createDefaultEntries = (callback: () => void) => {
		callback();
	};
}

export { Model, ModelBase };