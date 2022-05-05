interface Columns {
	id: string;
	tableName: string;
	originalValue: Record<string, unknown>;
	modifiedValue: Record<string, unknown>;
}

type MutationsParams = Partial<Columns>;

export {
	MutationsParams,
	Columns,
};
