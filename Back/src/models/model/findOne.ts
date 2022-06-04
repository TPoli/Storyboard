import { GenericObject } from 'core';
import { RowDataPacket } from 'mysql2';

import { query } from '../../db';
import { Schema } from '../schema';
import { generateQuery } from './find';
import { Model } from './model';
import { IIndexable } from './types';

export default async function findOneFn<Type extends Model>(schema: Schema, params: GenericObject): Promise<Type|null> {
	const { sql, queryParameters } = generateQuery(schema, params);

	try {
		const dbResults = await query(sql, queryParameters);

		if (!dbResults) {
			return null;
		}

		const result = Array.isArray(dbResults[0])
			? dbResults[0][0] as RowDataPacket
			: dbResults[0];

		const model = new schema({}) as unknown as Type;
		
		Object.entries(result).forEach(([key, value]) => {
			(model as IIndexable)[key] = value;
		});
		model.isNew = false;

		return model;
	} catch (error) {
		console.log('Database ERROR: ', JSON.stringify(error), '\n');
		return null;
	}
}
