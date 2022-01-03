import { ModelBase } from './model';
import { query } from '../../db';

/**
 * removes the record from the db permanently
 */
 const deleteModelFn = async (model: ModelBase): Promise<boolean> => {
	const sql = 'DELETE FROM ' + model.table + ' WHERE(`id` = ?)';

	try {
		const dbResults = await query(sql, [model.id,]);
		if (!dbResults) {
			console.log('no dbResults');
			return false;
		}

		return true;
	} catch (error) {
		console.log('Database ERROR: ', JSON.stringify(error), '\n');
		return false;
	}
}

export { deleteModelFn };
