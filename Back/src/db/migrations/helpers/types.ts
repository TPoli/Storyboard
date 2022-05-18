type MigrationDirectory = 'baseline' | 'data' | 'migrations';

type ColumnRelation = {
	sourceTable: String; 
	sourceColumn: String;
	referencedTable: String;
	referencedColumn: String;
}

export {
	ColumnRelation,
	MigrationDirectory,
}
