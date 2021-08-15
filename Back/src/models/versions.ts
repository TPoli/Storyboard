import { Model, Collumn } from './model';

export default class Versions extends Model {
	
	public version = 1;
	public static table = 'versions';
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
			name: 'version',
			primary: false,
			taintable: false,
			type: 'int'
		}
	] as Collumn[];

	constructor() {
		super();
	}
};