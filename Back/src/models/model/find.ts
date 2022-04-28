import { Schema } from '../schema';

const generateQuery = (schema: Schema, params: Object) => {
	const model = new schema({});

	let sql = 'SELECT ';
	const queryParameters: any[] = [];
	
	const allowedColumns = model.getMetaData().map((column: any) => {
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
