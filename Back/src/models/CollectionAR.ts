import {
	AccountAR,
	Model,
	Column,
	ColumnType,
	RecentCollectionsAR
} from './';
import { Collection } from '../../../Core/types/Collection';
import { LoggedInRequest } from '../types/types';

export class CollectionAR extends Model implements Collection {

	public id = '';
	public name = '';
	public siblingOrder = 0;
	public parent: Collection|null = null;
	public children: Collection[] = [];
	
	public version = 1;
	public table = 'collections';
	public account: number|null = null;
	public data: {
		content: string,
	}| null = null;
	public columns = [
		{
			name: 'id',
			primary: true,
			taintable: false,
			type: ColumnType.STRING,
			autoIncrement: false,
			nullable: false,
			unique: true,
		}, {
			name: 'account',
			primary: true,
			taintable: false,
			type: ColumnType.INT,
			references: {
				model: new AccountAR().table,
				column: 'id',
			},
		}, {
			name: 'name',
			primary: false,
			taintable: true,
			type: ColumnType.STRING,
			nullable: false,
		}, {
			name: 'siblingOrder',
			primary: false,
			taintable: true,
			type: ColumnType.INT,
			nullable: false,
		}, {
			name: 'parent',
			primary: false,
			taintable: true,
			type: ColumnType.INT,
			nullable: true,
			references: {
				model: this.table,
				column: 'id',
			},
		}, {
			name: 'data',
			primary: false,
			taintable: true,
			type: ColumnType.JSON,
			nullable: false,
		},
	] as Column[];

	constructor() {
		super();
	}

	public async afterSave(req: LoggedInRequest | null) {
		super.afterSave(req);

		if (!req) {
			return;
		}

		const recentCollectionsMap = req?.user?.recentCollectionsMap ?? new RecentCollectionsAR();

		if (this.id === recentCollectionsMap.recentId1) {
			// most recently modified this collection, nothing to update
			return;
		}
		recentCollectionsMap.recentId3 = recentCollectionsMap.recentId2;
		recentCollectionsMap.recentId2 = recentCollectionsMap.recentId1;
		recentCollectionsMap.recentId1 = this.id;
		recentCollectionsMap.account = req.user.id;
		recentCollectionsMap.save(() => {}, req, [
			'id',
			'account',
			'recentId1',
			'recentId2',
			'recentId3',
		]);
	}
}