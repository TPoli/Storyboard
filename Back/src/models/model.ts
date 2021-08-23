import { Db } from '../db';

type Collumn = {
	name: string;
	type: 'bool' | 'string' | 'int' | 'json' | 'datetime' | 'tinytext';
	taintable: boolean;
	primary: boolean;
	nullable: boolean;
	autoIncrement: boolean;
};

export interface IIndexable {
	[key: string]: any;
};

export type SaveCallback = (success: boolean) => void;
type RefreshCallback = () => void;

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

	save(callback: SaveCallback, collumns: string[] = []) {
		if (this.isNew) {
			if (collumns.length > 0) {
				const values: any[] = [];
				const paramKeys: string[] = [];
				collumns.forEach((collumn: string) => {
					paramKeys.push('?');
					const colData = this.collumns.find((col) => {
						return col.name === collumn;
					});
					if(!colData) {
						callback(false);
						return;
					}

					switch (colData.type) {
						case 'json':
						case 'datetime':
							values.push(JSON.stringify((this as IIndexable)[collumn]));
							break;
						case 'bool':
						case 'int':
						case 'string':
						case 'tinytext':
							values.push((this as IIndexable)[collumn]);
							console.log((this as IIndexable)[collumn])
							break;
						default:
							callback(false);
							return;
					};
				});
				
				let sql = 'INSERT INTO ' + this.table + '(' + collumns.join(',') + ') VALUES (' + paramKeys.join(',') + ')';

				console.log(sql);

				Db.execute(sql, values, (error: any, results: any[], fields: any) => {
					console.log(error);
					if (error || !results) {
						callback(false);
						return;
					}
					this.isNew = false;
					callback(true);
				});
			} else {
				console.log('INCOMPLETE');
				callback(false);
			}
		} else {
			console.log('INCOMPLETE');
			callback(false);
		}
	};

	// use after save() if you need to access any auto generated data such as ID
	refresh(callback: RefreshCallback): void {
		callback();
	};
}

export {Model};
export {Collumn};