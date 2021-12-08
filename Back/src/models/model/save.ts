import { OkPacket } from 'mysql2';
import { promisedExecute } from '../../db';
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
			const dbResults = await promisedExecute(sql, values);
			if (!dbResults) {
				console.log('no dbResults');
				return false;
			}
			model.isNew = false;
			if (model.id === '' || model.id === -1) {
				model.id = (dbResults[0] as OkPacket).insertId;
			}

			return true;
		} catch (error) {
			console.log('Database ERROR: ', JSON.stringify(error), '\n');
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
			console.log('failed to parametise');
			return false;
		}

		const sql = `UPDATE ${model.table} SET ${columns.join('= ?,')} = ? WHERE id = '${model.id}'`;

		try {
			const dbResults = await promisedExecute(sql, values);
			if (!dbResults) {
				return false;
			}

			return true;
		} catch (error) {
			console.log(JSON.stringify(error));

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