import { Model, Collumn } from './model';

export default class Account extends Model {
	
	public version = 1;
	public table = 'account';
	public collumns = [
		{
			name: 'id',
			primary: true,
			taintable: false,
			type: 'int',
			autoIncrement: true,
			nullable: false
		}, {
			name: 'username',
			primary: false,
			taintable: true,
			type: 'string'
		}, {
			name: 'password',
			primary: false,
			taintable: true,
			type: 'tinytext'
		}, {
			name: 'permissions',
			primary: false,
			taintable: false,
			type: 'json'
		}
	] as Collumn[];

	public id: number = -1;
	public username: string = '';
	public password: string = '';
	public permissions: Object = {};

	constructor() {
		super();
	}
};