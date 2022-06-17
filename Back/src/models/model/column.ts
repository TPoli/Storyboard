import 'reflect-metadata';
import { ColumnType } from './columnType';
import { ModelBase } from './model';
import { Column } from './types';

const columnDataKey = Symbol('columnData');

const columnTypeToSQL = (jsType: string, field: string) => {
	switch (jsType.toLowerCase()) {
		case 'string':
			return ColumnType.STRING;
		case 'boolean':
			return ColumnType.BOOL;
		case 'number':
			return ColumnType.INT;
		default:
			throw new Error(`unhandled column type ${field} ->${jsType}`);
	}
};

function column(params?: Partial<Column>): PropertyDecorator {
	return (target, key) => {
		const columnData: Column[] = Reflect.getOwnMetadata(columnDataKey, target) || [];
		if (!columnData.find(col => col.name === key)) {
			columnData.push({
				name: String(key),
				type: params?.type ?? columnTypeToSQL(Reflect.getMetadata('design:type', target, key).name, `${(target as ModelBase).table}:${key as string}`),
				primary: params?.primary ?? false,
				taintable: params?.taintable ?? false,
				autoIncrement: params?.autoIncrement ?? false,
				nullable: params?.nullable ?? false,
				unique: params?.unique ?? false,
				default: params?.default,
				references: params?.references,
			});
		}
		Reflect.defineMetadata(columnDataKey, columnData, target);
	}
}

export {
	column,
	columnDataKey,
};
