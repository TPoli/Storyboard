import * as mysqlPromise from 'mysql2/promise';

abstract class Migration {
	up: () => Promise<void|boolean>;
	down: () => Promise<void|boolean>;

	connection: mysqlPromise.Connection;

	constructor(connection: mysqlPromise.Connection) {
		this.connection = connection;
	}
}

export {
	Migration,
}
