import { Model, Collumn, CollumnType } from './model';

export default class Mutations extends Model {
	
	public version = 1;
	public static table = 'mutations';
	public collumns = [
		{
			name: 'id',
			primary: true,
			taintable: false,
			type: CollumnType.int,
			autoIncrement: true,
			nullable: false,
			unique: true
		}, {
			name: 'table_name',
			primary: false,
			taintable: false,
			type: CollumnType.string
		}, {
			name: 'original_value',
			primary: false,
			taintable: true,
			type: CollumnType.json
		}, {
			name: 'modified_value',
			primary: false,
			taintable: true,
			type: CollumnType.json
		}, 
	] as Collumn[];

	constructor() {
		super();
	}
};