import * as express from 'express';

import Account from './account';
import { Model, Collumn, CollumnType } from './model';
import { Content } from '../../../Core/types/Content';
import { Collection } from '../../../Core/types/Collection';

export default class CollectionAR extends Model implements Collection {

	public id: number = -1;
	public name: string = '';
	public siblingOrder: number = 0;
	public parent: Collection|null = null;
	public children: Collection[] = [];
	public content: Content[] = [];
	
	public version = 1;
	public table = 'collections';
	public account: Account|null = null;
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
			name: 'name',
			primary: false,
			taintable: true,
			type: CollumnType.string,
			nullable: false,
		}, {
			name: 'siblingOrder',
			primary: false,
			taintable: true,
			type: CollumnType.int,
			nullable: false
		}, {
			name: 'parent',
			primary: false,
			taintable: true,
			type: CollumnType.int,
			nullable: true,
			references: {
				model: this.table,
				collumn: 'id'
			},
		}
	] as Collumn[];

	constructor() {
		super();
	}
};