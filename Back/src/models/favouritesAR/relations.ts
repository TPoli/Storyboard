import {
	RelationType,
	IModelRelation
} from '../';

const modelRelations: IModelRelation[] = [
	{
		table: 'account',
		join: 'left',
		name: 'account',
		childColumn: 'id',
		parentColumn: 'accountId',
		relationType: RelationType.ONE_TO_ONE,
	}, {
		table: 'collections',
		join: 'left',
		name: 'collection',
		childColumn: 'id',
		parentColumn: 'collectionId',
		relationType: RelationType.ONE_TO_ONE,
	},
];

export { modelRelations };
