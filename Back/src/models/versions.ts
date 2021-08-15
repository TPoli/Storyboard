import { Model, Collumn } from './model';

export default class Versions extends Model {
	
	public version = 1;
	public table = 'versions';
	public collumns = [
		{
			name: 'id',
			primary: true,
			taintable: false,
			type: 'int'
		}
	] as Collumn[];

	constructor() {
		super();
	}
};