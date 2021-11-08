import { Db } from '../../db';
import { ColumnType } from './columnType';
import { ModelBase } from './model';
import { IIndexable } from './types';

const parametise = (model: ModelBase, columns: string[]) => {
	const keys: string[] = [];
	const values: any[] = [];

	const success = columns.every((column: string): boolean => {
		const colData = model.columns.find((col) => {
			return col.name === column;
		});
		if(!colData) {
			return false;
		}

		const value = (model as IIndexable)[column];
		if (colData.nullable && value === null) {
			return true;
		}

		keys.push('?');

		switch (colData.type) {
			case ColumnType.JSON:
			case ColumnType.DATE_TIME:
				values.push(JSON.stringify(value));
				break;
			case ColumnType.BOOL:
			case ColumnType.INT:
			case ColumnType.STRING:
			case ColumnType.TINY_TEXT:
				values.push(value);
				break;
			default:
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
	if (columns.length > 0) {
		
		const { keys, values, success, } = parametise(model, columns);

		if (!success) {
			return false;
		}
		
		const sql = 'INSERT INTO ' + model.table + '(' + columns.join(',') + ') VALUES (' + keys.join(',') + ')';

		try {
			const dbResults = await Db.promisedExecute(sql, values);
			if (!dbResults) {
				return false;
			}
			model.isNew = false;
			if (model.id === '' || model.id === -1) {
				model.id = (dbResults[0] as any).insertId;
			}

			return true;
		} catch (error) {
			return false;
		}
	} else {
		console.log('INCOMPLETE');
		return false;
	}
};

const update = async (model: ModelBase, columns: string[]): Promise<boolean> => {
	if (columns.length > 0) {
		const { values, success, } = parametise(model, columns);

		if (!success) {
			return false;
		}

		const sql = `UPDATE ${model.table} SET ${columns.join('= ?,')} = ? WHERE id = ${model.id}`;

		try {
			const dbResults = await Db.promisedExecute(sql, values);
			if (!dbResults) {
				return false;
			}

			return true;
		} catch (error) {
			return false;
		}
	} else {
		console.log('INCOMPLETE');
		return false;
	}
};

/**
 * saves the model to db and updates the isNew and id fields
 * @param model 
 * @param callback 
 * @param columns 
 */
const saveModelFn = async (model: ModelBase, columns: string[] = []): Promise<boolean> => {
	if (model.isNew) {
		return await insert(model, columns);
	} else {
		return await update(model, columns);
	}
}

export { saveModelFn };