import * as mysqlPromise from 'mysql2/promise';

function getCallerFile()
{
    const prepareStackTraceOrg = (Error as any).prepareStackTrace;
    const err = new Error();

    (Error as any).prepareStackTrace = (_, stack) => stack;

    const stack = err.stack;

    (Error as any).prepareStackTrace = prepareStackTraceOrg;

	const fileName: String = (stack as any)[2].getFileName();

	const separatedFileName = fileName.split(/\\|\//);

    return separatedFileName[separatedFileName.length - 1];
}

abstract class Migration {
	protected _up: () => Promise<void|boolean>;
	protected _down: () => Promise<void|boolean>;

	private _fileName: String;

	connection: mysqlPromise.Connection;
	protected _alwaysRun = false;

	public up: () => Promise<void|boolean> = async () => {
		if (!this._alwaysRun) {
			const [rows] = await this.connection.query(`
				SELECT COUNT(*) as runPreviously FROM storyboard.migrations WHERE migration = ? LIMIT 1;
			`, [this._fileName]);

			if(!rows || !rows[0] || rows[0].runPreviously !== 0) {
				return true; // already marked complete
			}
		}

		const result = await this._up();
		
		if (result === false) {
			return false;
		}

		if (!this._alwaysRun) {
			await this.connection.execute(`
				INSERT INTO storyboard.migrations (migration, completed) VALUES (?, Now());
			`, [this._fileName]);
		}
	};
	public down: () => Promise<void|boolean> = async () => {
		const result = await this._down();

		if (result === false) {
			return false;
		}
		// TODO have this remove migration from migrations table if needed
	};

	constructor(connection: mysqlPromise.Connection) {
		this.connection = connection;
		this._fileName = getCallerFile();
	}
}

export {
	Migration,
}
