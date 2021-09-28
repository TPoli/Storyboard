import { Model, Collumn, CollumnType } from './model';

export default class Versions extends Model {
	
	public version = 1;
	public static table = 'versions';
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
			name: 'version',
			primary: false,
			taintable: false,
			type: CollumnType.int
		}
	] as Collumn[];

	constructor() {
		super();
	}
};