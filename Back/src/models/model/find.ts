import { GenericObject } from 'core';
import { Schema } from '../schema';

type Query = {
	sql: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	queryParameters: any[];
};

const generateQuery = (schema: Schema, params: GenericObject): Query => {
	const model = new schema({});

	let sql = 'SELECT ';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const queryParameters: any[] = [];
	
	const allowedColumns = model.getMetaData().map((column) => {
		return column.name;
	});

	sql += allowedColumns.join(',') + ' FROM ' + model.table + ' WHERE ';

	let firstValidColumn = true;
	for (const [key, value] of Object.entries(params)) {
		if ((allowedColumns as string[]).includes(key)) {
			if (!firstValidColumn) {
				sql += ' AND';
			}
			firstValidColumn = false;
			sql += key + ' = ? ';

			queryParameters.push(value);
		}
	}

	return {
		sql,
		queryParameters,
	};
};

export {
	generateQuery,
};
