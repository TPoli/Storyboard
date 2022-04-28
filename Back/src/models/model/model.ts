import findAllFn from './findAll';
import findOneFn from './findOne';
import { IModelRelation } from './modelRelation';
import { saveModelFn } from './save';
import { Column, IIndexable } from './types';
import { addRelationship } from './index';
import { LoggedInRequest } from '../../types/types';
import { deleteModelFn } from './delete';
import { Schema } from '../schema';
import { TableNames } from '../tableNames';
import { randomUUID } from 'crypto';
import { columnDataKey } from './column';

abstract class ModelBase implements IIndexable {
	public table: TableNames = TableNames.ABSTRACT;
	public abstract version: number;
	public isNew = true;

	id: string;

	public modelRelations: IModelRelation[] = [];

	public getMetaData(): Column[] {
		return Reflect.getMetadata(columnDataKey, this);
	}

	constructor() {
		this.id = '';
	}
}

abstract class Model extends ModelBase {

	constructor() {
		super();
	}

	public init = () => {
		this.modelRelations.forEach(relation => {
			addRelationship(this, relation);
		});
	}

	public static find<Type extends Model>(schema: Schema, params: Object): Promise<Type[]> {
		return findAllFn(schema, params);
	}

	public async findOne<Type extends Model>(params: Object): Promise<Type|null> {
		return await findOneFn(this as unknown as Type, params);
	}

	/**
	 * overload this function if there is any preparation required before saving.
	 * @param req LoggedInRequest|null
	 * @returns Promise<boolean>
	 */
	protected async beforeSave(req: LoggedInRequest|null): Promise<boolean> {
		if (!this.id) {
			this.id = randomUUID();
		}
		return true;
	}

	public async save<Type>(req: LoggedInRequest|null, columns: Extract<keyof Type, string>[] = []): Promise<boolean> {
		if(!await this.beforeSave(req)) {
			return false;
		}
		if (!await saveModelFn(this, columns)) {
			return false;
		}
		return await this.afterSave(req);
	}

	public async delete(req: LoggedInRequest|null): Promise<boolean> {
		// TODO add before delete hook
		if (!await deleteModelFn(this)) {
			return false;
		}

		return true;

		// TODO add after delete hook
	}

	/**
	 * overload this function if there is any logic that needs to be executed after saving.
	 * @param req LoggedInRequest|null
	 * @returns Promise<boolean>
	 */
	protected async afterSave(req: LoggedInRequest|null): Promise<boolean> {
		return true;
	}

	// use after save() if you need to access any auto generated data such as ID
	public async refresh(): Promise<void> {
		return; // not implemented yet
	}

	public createDefaultEntries = async () => {
		return;
	};

	public getAllColumns = () => {
		return this.getMetaData().map(columnData => {
			return columnData.name;
		});
	}
}

export { Model, ModelBase };