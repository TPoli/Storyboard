import * as mysql from 'mysql2';
import { Db } from '../../db';
import { Column, ColumnType, IIndexable, RefreshCallback, SaveCallback } from './types';

abstract class Model implements IIndexable {
	public table = '';
	public abstract version: number;
	public abstract columns: Column[]
	protected isNew = true;

	id = -1;

	public static find<Type>(): Type|null {
		return null;
	}

	public findOne<Type extends Model>(params: Object, callback: (error: mysql.QueryError|null, result: Type|null) => void): void {

		let sql = 'SELECT ';
		const usedParameters: any[] = [];
		
		const allowedColumns = this.columns.map((column) => {
			return column.name;
		});

		sql += allowedColumns.join(',') + ' FROM ' + this.table + ' WHERE ';

		let firstValidColumn = true;
		for (const [key, value,] of Object.entries(params)) {
			if (allowedColumns.includes(key)) {
				if (!firstValidColumn) {
					sql += ' AND';
				}
				firstValidColumn = false;
				sql += key + ' = ? ';

				usedParameters.push(value);
			}
		}

		const queryCallback: Db.DbCallback = (error, results, fields) => {
			if (error || !results || !results[0]) {
				callback(error, null);
				return;
			}
			const result = results[0];
			
			Object.entries(result).forEach(([key, value,]) => {
				(this as IIndexable)[key] = value;
			});
			this.isNew = false;

			callback(error, this as unknown as Type);
		};

		Db.execute(sql, usedParameters, queryCallback);
	}

	save(callback: SaveCallback, columns: string[] = []) {
		if (this.isNew) { // insert
			if (columns.length > 0) {
				const values: any[] = [];
				const paramKeys: string[] = [];
				columns.forEach((column: string) => {
					const colData = this.columns.find((col) => {
						return col.name === column;
					});
					if(!colData) {
						callback(false);
						return;
					}

					const value = (this as IIndexable)[column];
					if (colData.nullable && value === null) {
						return;
					}

					paramKeys.push('?');

					switch (colData.type) {
						case ColumnType.json:
						case ColumnType.datetime:
							values.push(JSON.stringify(value));
							break;
						case ColumnType.bool:
						case ColumnType.int:
						case ColumnType.string:
						case ColumnType.tinytext:
							values.push(value);
							break;
						default:
							callback(false);
							return;
					}
				});
				
				const sql = 'INSERT INTO ' + this.table + '(' + columns.join(',') + ') VALUES (' + paramKeys.join(',') + ')';

				Db.execute(sql, values, (error, results, fields) => {
					if (error || !results) {
						console.log(error);
						callback(false);
						return;
					}
					this.isNew = false;
					this.id = (results as any).insertId;
					callback(true);
				});
			} else {
				console.log('INCOMPLETE');
				callback(false);
			}
		} else { // update
			if (columns.length > 0) {
				const values: any[] = [];
				columns.forEach((column: string) => {
					const colData = this.columns.find((col) => {
						return col.name === column;
					});
					if(!colData) {
						callback(false);
						return;
					}

					const value = (this as IIndexable)[column];
					if (colData.nullable && value === null) {
						return;
					}

					switch (colData.type) {
						case ColumnType.json:
						case ColumnType.datetime:
							values.push(JSON.stringify(value));
							break;
						case ColumnType.bool:
						case ColumnType.int:
						case ColumnType.string:
						case ColumnType.tinytext:
							values.push(value);
							break;
						default:
							callback(false);
							return;
					}
				});

				const sql = `UPDATE ${this.table} SET ${columns.join('= ?,')} = ? WHERE id = ${this.id}`;

				Db.execute(sql, values, (error, results, fields) => {
					if (error || !results) {
						console.log(error);
						callback(false);
						return;
					}
					this.isNew = false;
					this.id = (results as any).insertId;
					callback(true);
				});
			} else {
				console.log('INCOMPLETE');
				callback(false);
			}
		}
	}

	// use after save() if you need to access any auto generated data such as ID
	refresh(callback: RefreshCallback): void {
		callback();
	}

	public createDefaultEntries = (callback: () => void) => {
		callback();
	};
}

export {Model};