import * as express from 'express';

import Account from './account';
import { Model, Collumn, CollumnType, SaveCallback } from './model';
import { IResponse } from '../../../Core/types/Response';

export default class Transactions extends Model {
	
	public version = 1;
	public table = 'transactions';
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
			name: 'account',
			primary: true,
			taintable: false,
			type: CollumnType.int,
			references: {
				model: new Account().table,
				collumn: 'id'
			}
		}, {
			name: 'route',
			primary: false,
			taintable: false,
			type: CollumnType.string,
			nullable: false
		}, {
			name: 'ipAddress',
			primary: false,
			taintable: true,
			type: CollumnType.string,
			nullable: false
		}, {
			name: 'params',
			primary: false,
			taintable: true,
			type: CollumnType.json,
			nullable: false
		}, {
			name: 'response',
			primary: false,
			taintable: true,
			type: CollumnType.json
		}
	] as Collumn[];

	public id: number = -1;
	public account: number = 1;
	public route: string = '';
	public params: Object = {};
	public response: Object|null = null;
	public ipAddress: string = '';

	constructor() {
		super();
	}

	public sendResponse = (response: express.Response, payload: IResponse) => {
		response.send(payload); // dont wait for db to resolve to respond to user

		this.response = payload;
		const callback: SaveCallback = (success) => {}; // unused but required
		this.save(callback, ['response']);
	}
};