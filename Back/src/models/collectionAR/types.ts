type CollectionData = {
	content: string;
	description: string;
};

interface Columns {
	id: string;
	name: string;
	beforeCollection: string|null;
	afterCollection: string|null;
	parentId: string|null;
	data: CollectionData;
}

type CollectionsParams = Partial<Columns>;

export {
	CollectionsParams,
	Columns,
	CollectionData,
};
