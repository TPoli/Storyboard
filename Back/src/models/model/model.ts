import findAllFn from './findAll';
import findOneFn from './findOne';
import { saveModelFn } from './save';
import { Column, IIndexable } from './types';
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

	public static async findAll<Type extends Model>(schema: Schema, params: Record<string, unknown>): Promise<Type[]> {
		return findAllFn(schema, params);
	}

	public static async findOne<Type extends Model>(schema: Schema, params: Record<string, unknown>): Promise<Type|null> {
		return await findOneFn(schema, params);
	}

	/**
	 * overload this function if there is any preparation required before saving.
	 * @param req LoggedInRequest|null
	 * @returns Promise<boolean>
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected async afterSave(req: LoggedInRequest|null): Promise<boolean> {
		return true;
	}

	// use after save() if you need to access any auto generated data such as ID
	public async refresh(): Promise<void> {
		return; // not implemented yet
	}

	public createDefaultEntries = async (): Promise<void> => {
		return;
	};

	public getAllColumns = (): string[] => {
		return this.getMetaData().map(columnData => {
			return columnData.name;
		});
	}
}

export { Model, ModelBase };