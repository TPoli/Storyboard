import { RowDataPacket } from 'mysql2';
import { Model } from '.';

import { query } from '../../db';
import { Schema } from '../schema';
import { IIndexable } from './types';

export default async function findAllFn<Type extends Model>(schema: Schema, params: Object): Promise<Type[]> {
	let sql = 'SELECT ';
	const usedParameters: any[] = [];

	const model = new schema();
	
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

	try {
		const dbResults = await query(sql, usedParameters);

		if (!dbResults) {
			return [];
		}

		const results = Array.isArray(dbResults[0])
			? dbResults[0] as RowDataPacket[]
			: dbResults;

		return results.map(result => {
			const newModel = new schema() as unknown as Type;
			newModel.isNew = false;
			Object.entries(result).forEach(([key, value,]) => {
				(newModel as IIndexable)[key] = value;
			});
			return newModel;
		}) as Type[];
	} catch (error) {
		console.log('Database ERROR: ', JSON.stringify(error), '\n');
		return [];
	}
}
