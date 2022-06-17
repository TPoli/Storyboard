import * as mysqlPromise from 'mysql2/promise';
import { RowDataPacket } from 'mysql2/promise';

import { ensureDbIsSetup } from './databaseSetup';

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
		throw new Error('user database connection not established');
	}
	
	return userConnection;
}

export const InitDb = async () => {
	const connections = await ensureDbIsSetup();
	userConnection = connections.userConnection;
	adminConnection = connections.adminConnection;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const query = async (statement: string, params: any[] = []) => {
	return (await UserConnection().query<RowDataPacket[]>(statement, params))[0];
};
