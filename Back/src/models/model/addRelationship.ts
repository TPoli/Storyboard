import { Db } from '../../db';
import { createModel } from '../modelFactory';
import { IModelRelation } from './modelRelation';
import { IIndexable } from './types';

type Signature = (model: any, relation: IModelRelation) => void;

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

				
				// TODO this implementation handles 1 to 1 relations only
				const relationModel = createModel(relation.table);
				if (!relationModel) {
					throw new Error(`Unknown relationship ${this.table} -> ${relation.table}`);
				}
				Object.entries(rows).forEach(([key, value,]) => {
					(relationModel as IIndexable)[key] = value;
				});
				relationModel.isNew = false;
				
				(this as IIndexable)[dataKey] = relationModel;
			}

			return (this as IIndexable)[dataKey];
		},
		enumerable: true,
		configurable: true, 
	});
};

export {addRelationship};