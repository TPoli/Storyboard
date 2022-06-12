import { query } from '../../db';
import { ColumnType } from './columnType';
import { Model, ModelBase } from './model';
import { IIndexable } from './types';

const parametise = (model: ModelBase, columns: string[]) => {
	const keys: string[] = [];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const values: any[] = [];

	const success = columns.every((column: string): boolean => {
		const colData = model.getMetaData().find((col) => {
			return col.name === column;
		});
		if(!colData) {
			console.log(`couldn't find column for ${column}`);
			return false;
		}

		keys.push('?');

		const value = (model as IIndexable)[column];
		if (value === null) {
			if (!colData.nullable) {
				return false;
			}
			values.push(null);
			return true;
		}

		switch (colData.type) {
			case ColumnType.JSON:
				values.push(JSON.stringify(value));
				break;
			case ColumnType.DATE_TIME:
				values.push(value.toISOString().slice(0, 19).replace('T', ' '));
				break;
			case ColumnType.BOOL:
			case ColumnType.INT:
			case ColumnType.STRING:
			case ColumnType.TINY_TEXT:
				values.push(value);
				break;
			default:
				console.log(`couldn't resolve column type: ${colData.type}`)
				return false;
		}
		return true;
	});

	return {
		keys,
		values,
		success,
	};
};

const insert = async (model: ModelBase, columns: string[]): Promise<boolean> => {
	const { keys, values, success } = parametise(model, columns);

	if (!success) {
		return false;
	}
	
	const sql = 'INSERT INTO ' + model.table + '(' + columns.join(',') + ') VALUES (' + keys.join(',') + ')';

	try {
		const dbResults = await query(sql, values);
		
		if (!dbResults) {
			console.log('no dbResults');
			return false;
		}
		model.isNew = false;

		return true;
	} catch (error) {
		console.log('Database ERROR: ', JSON.stringify(error), '\n');
		return false;
	}
};

const update = async (model: ModelBase, columns: string[]): Promise<boolean> => {
	const { values, success } = parametise(model, columns);

	if (!success) {
		console.log('failed to parametise');
		return false;
	}

	const sql = `UPDATE ${model.table} SET ${columns.join('= ?,')} = ? WHERE id = '${model.id}'`;

	try {
		const dbResults = await query(sql, values);
		if (!dbResults) {
			return false;
		}

		return true;
	} catch (error) {
		console.log(JSON.stringify(error));

		return false;
	}
};

/**
 * saves the model to db and updates the isNew and id fields
 * @param model 
 * @param callback 
 * @param columns 
 */
const saveModelFn = async (model: Model, columns: string[] = []): Promise<boolean> => {
	const columnsToUse = columns ? columns : model.getAllColumns();
	if (model.isNew) {
		return await insert(model, columnsToUse);
	} else {
		return await update(model, columnsToUse);
	}
}

export { saveModelFn };