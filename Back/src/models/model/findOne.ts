import * as mysql from 'mysql2';

import { Db } from '../../db';
import { Model, ModelBase } from './model';
import { IIndexable } from './types';

export default function findOneFn<Type extends Model>(model: ModelBase, params: Object, callback: (error: mysql.QueryError|null, result: Type|null) => void) {
	let sql = 'SELECT ';
	const usedParameters: any[] = [];
	
	const allowedColumns = model.columns.map((column) => {
		return column.name;
	});

	sql += allowedColumns.join(',') + ' FROM ' + model.table + ' WHERE ';

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
			(model as IIndexable)[key] = value;
		});
		model.isNew = false;

		callback(error, model as unknown as Type);
	};

	Db.execute(sql, usedParameters, queryCallback);
}
