export enum RelationType {
	ONE_TO_ONE = '1-1',
	ONE_TO_MANY = '1+'
}

export interface IModelRelation {
	name: string;
	table: string;
	join: 'left' | 'inner' | 'outer';
	relationType: RelationType,
	parentColumn: string;
	childColumn: string;
}
