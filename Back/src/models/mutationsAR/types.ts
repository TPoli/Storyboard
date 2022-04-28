interface Columns {
	id: string;
	tableName: string;
	originalValue: Object;
	modifiedValue: Object;
}

type MutationsParams = Partial<Columns>;

export {
	MutationsParams,
	Columns,
};
