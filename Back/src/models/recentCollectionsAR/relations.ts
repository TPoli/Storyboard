import {
	RelationType,
	IModelRelation
} from '../';

const modelRelations: IModelRelation[] = [
	{
		table: 'collections',
		join: 'left',
		name: 'recent1',
		childColumn: 'id',
		parentColumn: 'recentId1',
		relationType: RelationType.ONE_TO_ONE,
	}, {
		table: 'collections',
		join: 'left',
		name: 'recent2',
		childColumn: 'id',
		parentColumn: 'recentId2',
		relationType: RelationType.ONE_TO_ONE,
	}, {
		table: 'collections',
		join: 'left',
		name: 'recent3',
		childColumn: 'id',
		parentColumn: 'recentId3',
		relationType: RelationType.ONE_TO_ONE,
	},
];

export { modelRelations };
