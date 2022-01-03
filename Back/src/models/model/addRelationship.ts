import { RowDataPacket } from 'mysql2/promise';
import { query } from '../../db';
import { createModel } from '../modelFactory';
import { Model } from './model';
import { IModelRelation, RelationType } from './modelRelation';
import { IIndexable } from './types';

type Signature = (model: any, relation: IModelRelation) => void;

const getRelationFromRow = (relation: IModelRelation, row: RowDataPacket): Model => {
	const relationModel = createModel(relation.table);
	if (!relationModel) {
		throw new Error(`Unknown relationship table ${relation.table}`);
	}
	Object.entries(row).forEach(([key, value,]) => {
		(relationModel as IIndexable)[key] = value;
	});
	relationModel.isNew = false;
	
	return relationModel;
};

const addRelationship: Signature = (model, relation) => {
	const dataKey = 'relation_' + relation.name;
	model[relation.name] = async () => {
		if (typeof (model as IIndexable)[dataKey] === 'undefined') {
			const sql = `SELECT * from ${relation.table} WHERE ${relation.childColumn} = ?`;
			const [ rows, ] = await query(sql, [(model as IIndexable)[relation.parentColumn],]);

			if (!Array.isArray(rows) || rows.length === 0) {
				(model as IIndexable)[dataKey] = null;
				
				return (relation.relationType === RelationType.ONE_TO_ONE
					? null
					: []
				);
			}

			const models: Model[] = [];
			rows.forEach(row => {
				models.push(
					getRelationFromRow(relation, row as RowDataPacket)
				);
			});
			
			if (relation.relationType === RelationType.ONE_TO_ONE) {
				(model as IIndexable)[dataKey] = models[0];
			} else {
				(model as IIndexable)[dataKey] = models;
			}
		}

		return (model as IIndexable)[dataKey];
	};
};

export {addRelationship};