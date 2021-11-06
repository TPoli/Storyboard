import * as mysql from 'mysql2';
import findOneFn from './findOne';
import saveModelFn from './save';
import { Column, IIndexable, RefreshCallback, SaveCallback } from './types';

interface ModelRelation {
	name: string;
	table: string;
	join: 'left' | 'inner' | 'outer';
	parentColumn: string;
	childColumn: string;

	// should build query like
	// SELECT base.*, ${name}.* from this.table AS base ${join} ${table} as ${name} ON this.${parentColumn} = ${childColumn}
}

abstract class ModelBase implements IIndexable {
	public table = '';
	public abstract version: number;
	public abstract columns: Column[];
	public isNew = true;
	id = -1;

	public modelRelations: ModelRelation[] = [];
}

abstract class Model extends ModelBase {

	public static find<Type>(): Type|null {
		return null;
	}

	public findOne<Type extends Model>(params: Object, callback: (error: mysql.QueryError|null, result: Type|null) => void): void {
		findOneFn(this, params, callback);
	}

	public save(callback: SaveCallback, columns: string[] = []) {
		saveModelFn(this, callback, columns);
	}

	// use after save() if you need to access any auto generated data such as ID
	public refresh(callback: RefreshCallback): void {
		callback();
	}

	public createDefaultEntries = (callback: () => void) => {
		callback();
	};
}

export {Model, ModelBase};