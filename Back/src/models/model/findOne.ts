import { RowDataPacket } from 'mysql2';

import { query } from '../../db';
import { Model } from './model';
import { IIndexable } from './types';

export default async function findOneFn<Type extends Model>(model: Type, params: Object): Promise<Type|null> {
	let sql = 'SELECT ';
	const usedParameters: any[] = [];
	
	const allowedColumns = model.getMetaData().map((column: any) => {
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

	try {
		const dbResults = await query(sql, usedParameters);

		if (!dbResults) {
			return null;
		}

		const result = Array.isArray(dbResults[0])
			? dbResults[0][0] as RowDataPacket
			: dbResults[0];
		
		Object.entries(result).forEach(([key, value,]) => {
			(model as IIndexable)[key] = value;
		});
		model.isNew = false;
		return model;
	} catch (error) {
		console.log('Database ERROR: ', JSON.stringify(error), '\n');
		return null;
	}
}
