import findOneFn from './findOne';
import { IModelRelation } from './modelRelation';
import { saveModelFn } from './save';
import { Column, IIndexable } from './types';
import { addRelationship } from './index';
import { LoggedInRequest } from '../../types/types';
import { deleteModelFn } from './delete';

abstract class ModelBase implements IIndexable {
	public table = '';
	public abstract version: number;
	public columns: Column[] = [];
	public isNew = true;
	id: number|string = -1;

	public modelRelations: IModelRelation[] = [];
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

	public static find<Type>(): Type|null {
		return null;
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
		return true;
	}

	public async save(req: LoggedInRequest|null, columns: string[] = []): Promise<boolean> {
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
}

export { Model, ModelBase };