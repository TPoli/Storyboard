import { Model, Collumn } from './model';

export default class Session extends Model {
	
	public version = 1;
	public table = 'session';
	public collumns = [
		{
			name: 'account',
			primary: true,
			taintable: false,
			type: 'int',
			nullable: false
		}, {
			name: 'expires',
			primary: false,
			taintable: false,
			type: 'datetime',
			nullable: false
		}
	] as Collumn[];

	public account: number = -1;
	public expires: string = '';

	constructor() {
		super();
	}
};