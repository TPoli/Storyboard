import { Column } from '../../models';
import { ColumnType } from '../../models/model/columnType';
import { loadAllModels } from './helpers/loadModels';
import { ColumnRelation } from './helpers/types';

const fs = require('fs');

const modifyBaselineMigration = (migrationName: String, fileName: String) => {
	const fileContents = fs.readFileSync(fileName, 'utf-8');

	const splitPath = fileName.split('/');
	const pathlessFileName = splitPath[splitPath.length - 1].split('.')[0];
	const migrationClassName = migrationName[0].toUpperCase() + migrationName.substring(1) + 'TableMigration';
  
	let updatedContents = fileContents.replace(/MIGRATIONNAME/gim, pathlessFileName);
	updatedContents = updatedContents.replace(/CLASSNAME/gim, migrationClassName);
	updatedContents = updatedContents.replace(/TABLENAME/gim, migrationName);
  
	fs.writeFileSync(fileName, updatedContents, 'utf-8');
}

const createBaselineMigration = (index: number, name: String, data: Column[]) => {
	const createTableTemplate = 'src/db/migrations/templates/createTable.ts';
	const baselineDirectory = 'src/db/migrations/baseline';

	const fileName = `${index.toString().padStart(3, '0')}_${name}`;
	fs.writeFileSync(`${baselineDirectory}/${fileName}.json`, JSON.stringify(data, null, 4));
	const outputFileName = `${baselineDirectory}/${fileName}.ts`;
	fs.copyFileSync(createTableTemplate, outputFileName);
	modifyBaselineMigration(name, outputFileName);
};

const modifyBaselineForeignKeyMigration = (fileName: String, data: ColumnRelation[]) => {
	const fileContents = fs.readFileSync(fileName, 'utf-8');
	const updatedContents = fileContents.replace(/\['DATA'\]/gim, JSON.stringify(data, null, 4));
	fs.writeFileSync(fileName, updatedContents, 'utf-8');
}

const createBaselineForeignKeys = (index: number, data: ColumnRelation[]) => {
	const template = 'src/db/migrations/templates/createForeignKeys.ts';
	const baselineDirectory = 'src/db/migrations/baseline';
	const name = 'foreignKeys';

	const fileName = `${index.toString().padStart(3, '0')}_${name}`;
	const outputFileName = `${baselineDirectory}/${fileName}.ts`;
	fs.copyFileSync(template, outputFileName);
	modifyBaselineForeignKeyMigration(outputFileName, data)
};

const baseline = async () => {
	console.log('beginning baseline');

	const models = await loadAllModels();

	const tables: { [key: string]: Column[] } = {};
	const relations: ColumnRelation[] = [];

	models.map(model => {
		const columns = model.getMetaData();
		tables[model.table] = columns;

		columns.map(column => {
			if (column.references) {
				relations.push({
					sourceTable: model.table,
					sourceColumn: column.name,
					referencedTable: column.references.model,
					referencedColumn: column.references.column,
				});
			}
		});
	});

	const migrationColumns: Column[] = [
		{
			name: 'migration',
			primary: true,
			taintable: false,
			autoIncrement: false,
			nullable: false,
			unique: true,
			type: ColumnType.STRING,
		}, {
			name: 'completed',
			autoIncrement: false,
			nullable: false,
			primary: false,
			taintable: false,
			type: ColumnType.DATE_TIME,
		}
	];

	let migrationId = 1;
	createBaselineMigration(migrationId++, 'migrations', migrationColumns);

	Object.keys(tables).forEach(tableName => {
		createBaselineMigration(migrationId++, tableName, tables[tableName]);
	});

	createBaselineForeignKeys(migrationId++, relations);

	console.log('baseline successful');
};

baseline();