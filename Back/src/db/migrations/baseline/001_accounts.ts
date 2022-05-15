import { Migration } from '../migration';

class AccountsMigration extends Migration {
	up: () => Promise<void|boolean> = async () => {
		console.log('upping Accounts Migration')
	};
	down: () => Promise<void|boolean> = async () => {
		return true;
	};
}

export default {
	AccountsMigration,
}
