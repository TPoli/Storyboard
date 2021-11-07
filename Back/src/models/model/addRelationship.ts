import { RowDataPacket } from 'mysql2/promise';
import { Db } from '../../db';
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
	Object.defineProperty(model, relation.name, {
		set: function(value) {
			(model as IIndexable)[dataKey] = value;
		},
		get: async function() {
			if (typeof (model as IIndexable)[dataKey] === 'undefined') {

				const sql = `SELECT * from ${relation.table} WHERE ${relation.childColumn} = ${(model as IIndexable)[relation.parentColumn]}`;
				const [ rows, ] = await Db.promisedExecute(sql, []);

				if (!Array.isArray(rows) || rows.length === 0) {
					(this as IIndexable)[dataKey] = null;
					return null;
				}

				const models: Model[] = [];
				rows.forEach(row => {
					models.push(
						getRelationFromRow(relation, row as RowDataPacket)
					);
				});
				
				if (relation.relationType === RelationType.ONE_TO_ONE) {
					(this as IIndexable)[dataKey] = models[0];
				} else {
					(this as IIndexable)[dataKey] = models;
				}
			}

			return (this as IIndexable)[dataKey];
		},
		enumerable: true,
		configurable: true, 
	});
};

export {addRelationship};