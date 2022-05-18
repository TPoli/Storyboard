const fs = require('fs');

import * as mysqlPromise from 'mysql2/promise';
import { loadMigrationFile } from './loadMigrationFile';
import { MigrationDirectory } from './types';

const runDirectoryMigrations = async (directory: MigrationDirectory, connection: mysqlPromise.Connection) => {
	try {
		const basePath = `./src/db/migrations/${directory}`;
        const fileNames: string[] = await fs.promises.readdir(basePath);

        for (const fileName of fileNames) {
            if (!fileName.endsWith('.ts')) {
                continue;
            }
			const migration = await loadMigrationFile(directory, fileName, connection);
			await migration.up(); // TODO add support for down
        }
    }
    catch (error) {
        console.error( `error occurred during ${directory} migrations`);
		throw(error); // we still want to stop execution
    }
};

export {
	runDirectoryMigrations,
}
