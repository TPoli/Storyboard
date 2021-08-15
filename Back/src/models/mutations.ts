import { Model, Collumn } from './model';

export default class Mutations extends Model {
	
	public version = 1;
	public static table = 'mutations';
	public collumns = [
		{
			name: 'id',
			primary: true,
			taintable: false,
			type: 'int',
			autoIncrement: true,
			nullable: false
		}, {
			name: 'table_name',
			primary: false,
			taintable: false,
			type: 'string'
		}, {
			name: 'original_value',
			primary: false,
			taintable: true,
			type: 'json'
		}, {
			name: 'modified_value',
			primary: false,
			taintable: true,
			type: 'json'
		}, 
	] as Collumn[];

	constructor() {
		super();
	}
};