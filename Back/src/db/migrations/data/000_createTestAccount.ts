import { Migration } from '../migration';

// TODO do not create test account this way in prod environments

class MigrationsTableMigration extends Migration {
	up: () => Promise<void|boolean> = async () => {
		await this.connection.execute(`
			INSERT INTO storyboard.account (
				id, username, password, salt, pepper
			)
			VALUES (
				'4ba99ec0-4349-4f1d-8cbd-f5a7500b6374',
				'test',
				'$2b$10$XESkAciqoOK.dOYhpOQU2.67UTuZ7qd/JyYuaADpJrQyUixW6.uN2',
				'$2b$10$XESkAciqoOK.dOYhpOQU2.',
				'$2b$10$zreUfwgHtRqDgU/zqPmD3O'
			)
			ON DUPLICATE KEY UPDATE
				username = 'test';
		`);

		await this.connection.execute(`
			INSERT INTO storyboard.account (id, username, password, salt, pepper, email, mobile)
			VALUES ('houseaccount', 'houseaccount', '', '', '', '', '')
			ON DUPLICATE KEY UPDATE
				username = 'houseaccount';
		`);
	};
	down: () => Promise<void|boolean> = async () => {
		return true;
	};
}

export default {
	MigrationsTableMigration,
}
