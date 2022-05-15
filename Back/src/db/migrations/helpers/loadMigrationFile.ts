import * as mysqlPromise from 'mysql2/promise';
import { Migration } from '../migration';
import { MigrationDirectory } from './types';

const loadMigrationFile = async (directory: MigrationDirectory, fileName: string, connection: mysqlPromise.Connection) => {
	const migrationFile = await import(`../${directory}/${fileName}`);

	const migrationName = Object.keys(migrationFile.default)[0];

	return new migrationFile.default[migrationName](connection) as Migration;
};

export {
	loadMigrationFile,
}
