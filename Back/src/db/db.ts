import * as mysqlPromise from 'mysql2/promise';

import { ensureDbIsSetup } from './databaseSetup';
import { ensureTablesSetup } from './tableSetup';

let userConnection: mysqlPromise.Connection|null = null;
let adminConnection: mysqlPromise.Connection|null = null;

export const AdminConnection = () => {
	if (!adminConnection) {
		throw new Error('admin database connection not established');
	}

	return adminConnection;
}

export const UserConnection = () => {
	if (!userConnection) {
		throw new Error('admin database connection not established');
	}
	
	return userConnection;
}

export const InitDb = async () => {
	const connections = await ensureDbIsSetup();
	userConnection = connections.userConnection;
	adminConnection = connections.adminConnection;

	return ensureTablesSetup();
};

export const query = async (statement: string, params: any[] = []) => {
	return await UserConnection().query(statement, params);
};
