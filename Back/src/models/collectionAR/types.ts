type CollectionData = {
	content: string;
	description: string;
};

interface Columns {
	id: string;
	name: string;
	before: string|null;
	after: string|null;
	parentId: string|null;
	data: CollectionData;
}

type CollectionsParams = Partial<Columns>;

export {
	CollectionsParams,
	Columns,
	CollectionData,
};
