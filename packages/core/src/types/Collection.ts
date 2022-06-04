
/**
 * used to represent the hierarchy of content
 */
 interface Collection {
	id: string;
	name: string;
	before: string;
	after: string;
	parentId: string|null;
	children: string[];
};

interface ICollection {
	uuid: string,
	title: string,
	content: string,
	favourite: boolean,
}

export {
	Collection,
	ICollection,
};
