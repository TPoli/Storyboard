import * as mysql from 'mysql2';
import { Db } from '../../db';
import saveModelFn from './save';
import { Column, IIndexable, RefreshCallback, SaveCallback } from './types';

abstract class ModelBase implements IIndexable {
	public table = '';
	public abstract version: number;
	public abstract columns: Column[]
	public isNew = true;
	id = -1;
}

abstract class Model extends ModelBase {

	public static find<Type>(): Type|null {
		return null;
	}

	public findOne<Type extends Model>(params: Object, callback: (error: mysql.QueryError|null, result: Type|null) => void): void {

		let sql = 'SELECT ';
		const usedParameters: any[] = [];
		
		const allowedColumns = this.columns.map((column) => {
			return column.name;
		});

		sql += allowedColumns.join(',') + ' FROM ' + this.table + ' WHERE ';

		let firstValidColumn = true;
		for (const [key, value,] of Object.entries(params)) {
			if (allowedColumns.includes(key)) {
				if (!firstValidColumn) {
					sql += ' AND';
				}
				firstValidColumn = false;
				sql += key + ' = ? ';

				usedParameters.push(value);
			}
		}

		const queryCallback: Db.DbCallback = (error, results, fields) => {
			if (error || !results || !results[0]) {
				callback(error, null);
				return;
			}
			const result = results[0];
			
			Object.entries(result).forEach(([key, value,]) => {
				(this as IIndexable)[key] = value;
			});
			this.isNew = false;

			callback(error, this as unknown as Type);
		};

		Db.execute(sql, usedParameters, queryCallback);
	}

	save(callback: SaveCallback, columns: string[] = []) {
		saveModelFn(this, callback, columns);
	}

	// use after save() if you need to access any auto generated data such as ID
	refresh(callback: RefreshCallback): void {
		callback();
	}

	public createDefaultEntries = (callback: () => void) => {
		callback();
	};
}

export {Model, ModelBase};