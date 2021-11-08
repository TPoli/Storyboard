import {
	RelationType,
	IModelRelation
} from '../';

const modelRelations: IModelRelation[] = [
	{
		table: 'collections',
		join: 'left',
		name: 'myCollections',
		childColumn: 'recentId1',
		parentColumn: 'id',
		relationType: RelationType.ONE_TO_ONE,
	}, {
		table: 'collections',
		join: 'left',
		name: 'myCollections',
		childColumn: 'recentId2',
		parentColumn: 'id',
		relationType: RelationType.ONE_TO_ONE,
	}, {
		table: 'collections',
		join: 'left',
		name: 'myCollections',
		childColumn: 'recentId3',
		parentColumn: 'id',
		relationType: RelationType.ONE_TO_ONE,
	},
];

export { modelRelations };
