type MigrationDirectory = 'baseline' | 'data' | 'migrations';

type ColumnRelation = {
	sourceTable: string; 
	sourceColumn: string;
	referencedTable: string;
	referencedColumn: string;
}

export {
	ColumnRelation,
	MigrationDirectory,
}
