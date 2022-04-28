type CollectionData = {
	content: string;
};

interface Columns {
	id: string;
	name: string;
	siblingOrder: number;
	parentId: string|null;
	data: CollectionData;
}

type CollectionsParams = Partial<Columns>;

export {
	CollectionsParams,
	Columns,
	CollectionData
};
