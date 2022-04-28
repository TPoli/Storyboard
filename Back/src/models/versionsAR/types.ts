interface Columns {
	id: string;
	tableName: string;
	tableVersion: number;
}

type VersionsParams = Partial<Columns>;

export {
	VersionsParams,
	Columns,
};
