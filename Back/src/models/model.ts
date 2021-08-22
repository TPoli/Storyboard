import { Db } from '../db';

type Collumn = {
	name: string;
	type: 'bool' | 'string' | 'int' | 'json' | 'datetime';
	taintable: boolean;
	primary: boolean;
	nullable: boolean;
	autoIncrement: boolean;
};

export interface IIndexable {
	[key: string]: any;
}

abstract class Model implements IIndexable {
	public table: string = '';
	public abstract version: number;
	public abstract collumns: Collumn[]
	protected isNew = true;

	public static find<Type>(): Type|null {
		return null;
	}

	public findOne<Type extends Model>(params: Object, callback: (error: Error, result: Type|null) => void): void {

		let sql = 'SELECT ';
		const usedParameters: any[] = [];
		
		const allowedCollumns = this.collumns.map((collumn) => {
			return collumn.name;
		});

		sql += allowedCollumns.join(',') + ' FROM ' + this.table + ' WHERE ';

		let firstValidCollumn = true;
		for (let [key, value] of Object.entries(params)) {
			if (allowedCollumns.includes(key)) {
				if (!firstValidCollumn) {
					sql += ' AND';
				}
				firstValidCollumn = false;
				sql += key + ' = ? ';

				usedParameters.push(value);
			}
		}

		Db.execute(sql, usedParameters, (error: any, results: any[], fields: any) => {
			if (error || !results) {
				callback(error, null);
				return;
			}
			const result = results[0];
			
			Object.entries(result).forEach(([key, value]) => {
				(this as IIndexable)[key] = value;
			});
			this.isNew = false;

			callback(error, this as unknown as Type);
		});
	}

	save(): boolean {
		return false;
	};

	// use after save() if you need to access any auto generated data such as ID
	refresh(): void {

	};
}

export {Model};
export {Collumn};