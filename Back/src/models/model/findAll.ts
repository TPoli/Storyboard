import { RowDataPacket } from 'mysql2';
import { Model } from '.';

import { query } from '../../db';
import { Schema } from '../schema';
import { generateQuery } from './find';
import { IIndexable } from './types';

export default async function findAllFn<Type extends Model>(schema: Schema, params: Object): Promise<Type[]> {
	const { sql, queryParameters } = generateQuery(schema, params);

	try {
		const dbResults = await query(sql, queryParameters);

		if (!dbResults) {
			return [];
		}

		const results = Array.isArray(dbResults[0])
			? dbResults[0] as RowDataPacket[]
			: dbResults;

		return results.map(result => {
			const newModel = new schema({}) as unknown as Type;
			newModel.isNew = false;
			Object.entries(result).forEach(([key, value]) => {
				(newModel as IIndexable)[key] = value;
			});

			return newModel;
		}) as Type[];
	} catch (error) {
		console.log('Database ERROR: ', JSON.stringify(error), '\n');
		return [];
	}
}
