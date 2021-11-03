import { Db } from '../../db';
import { ModelBase } from './model';
import { ColumnType, IIndexable, SaveCallback } from './types';

/**
 * saves the model to db and updates the isNew and id fields
 * @param model 
 * @param callback 
 * @param columns 
 */
export default function saveModelFn(model: ModelBase, callback: SaveCallback, columns: string[] = []) {
	if (model.isNew) { // insert
		if (columns.length > 0) {
			const values: any[] = [];
			const paramKeys: string[] = [];
			columns.forEach((column: string) => {
				const colData = model.columns.find((col) => {
					return col.name === column;
				});
				if(!colData) {
					callback(false);
					return;
				}

				const value = (model as IIndexable)[column];
				if (colData.nullable && value === null) {
					return;
				}

				paramKeys.push('?');

				switch (colData.type) {
					case ColumnType.json:
					case ColumnType.datetime:
						values.push(JSON.stringify(value));
						break;
					case ColumnType.bool:
					case ColumnType.int:
					case ColumnType.string:
					case ColumnType.tinytext:
						values.push(value);
						break;
					default:
						callback(false);
						return;
				}
			});
			
			const sql = 'INSERT INTO ' + model.table + '(' + columns.join(',') + ') VALUES (' + paramKeys.join(',') + ')';

			Db.execute(sql, values, (error, results, fields) => {
				if (error || !results) {
					console.log(error);
					callback(false);
					return;
				}
				model.isNew = false;
				model.id = (results as any).insertId;
				callback(true);
			});
		} else {
			console.log('INCOMPLETE');
			callback(false);
		}
	} else { // update
		if (columns.length > 0) {
			const values: any[] = [];
			columns.forEach((column: string) => {
				const colData = model.columns.find((col) => {
					return col.name === column;
				});
				if(!colData) {
					callback(false);
					return;
				}

				const value = (model as IIndexable)[column];
				if (colData.nullable && value === null) {
					return;
				}

				switch (colData.type) {
					case ColumnType.json:
					case ColumnType.datetime:
						values.push(JSON.stringify(value));
						break;
					case ColumnType.bool:
					case ColumnType.int:
					case ColumnType.string:
					case ColumnType.tinytext:
						values.push(value);
						break;
					default:
						callback(false);
						return;
				}
			});

			const sql = `UPDATE ${model.table} SET ${columns.join('= ?,')} = ? WHERE id = ${model.id}`;

			Db.execute(sql, values, (error, results, fields) => {
				if (error || !results) {
					console.log(error);
					callback(false);
					return;
				}
				model.isNew = false;
				model.id = (results as any).insertId;
				callback(true);
			});
		} else {
			console.log('INCOMPLETE');
			callback(false);
		}
	}
}