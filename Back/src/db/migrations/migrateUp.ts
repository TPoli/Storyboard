import * as mysqlPromise from 'mysql2/promise';
import { adminConnectionData } from '../config';
import { runDirectoryMigrations } from './helpers/runDirectoryMigrations';


const migrateUp = async () => {
	console.log('beginning migration');
	const connection = await mysqlPromise.createConnection(adminConnectionData);

	// up baseline migrations
	await runDirectoryMigrations('baseline', connection);

	// up data migrations
	await runDirectoryMigrations('data', connection);

	// run normal migrations
	await runDirectoryMigrations('migrations', connection);

	console.log('all migrations successful');
	connection.end();
};

migrateUp();