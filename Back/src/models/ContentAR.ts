import * as express from 'express';

import Account from './account';
import { Model, Column, ColumnType } from './model';
import { Content } from '../../../Core/types/Content';
import { Collection } from '../../../Core/types/Collection';
import CollectionAR from './CollectionAR';

export default class ContentAR extends Model implements Content {

	public id: number = -1;
	public name: string = '';
	public siblingOrder: number = 0;
	public parent: Collection|null = null;
	public data: Object = {};
	
	public version = 1;
	public table = 'content';
	public account: Account|null = null;
	public columns = [
		{
			name: 'id',
			primary: true,
			taintable: false,
			type: ColumnType.int,
			autoIncrement: true,
			nullable: false,
			unique: true
		}, {
			name: 'account',
			primary: true,
			taintable: false,
			type: ColumnType.int,
			references: {
				model: new Account().table,
				column: 'id'
			}
		}, {
			name: 'siblingOrder',
			primary: false,
			taintable: true,
			type: ColumnType.int,
			nullable: false
		}, {
			name: 'parent',
			primary: false,
			taintable: true,
			type: ColumnType.int,
			nullable: false,
			references: {
				model: new CollectionAR().table,
				column: 'id'
			}
		}, {
			name: 'data',
			primary: false,
			taintable: true,
			type: ColumnType.json,
			nullable: false
		}
	] as Column[];

	constructor() {
		super();
	}
};