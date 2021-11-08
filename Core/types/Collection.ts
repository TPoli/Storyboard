
/**
 * used to represent the hierarchy of content
 */
 interface Collection {
	id: string;
	name: string;
	siblingOrder: number;
	parent: Collection|null;
	children: Collection[];
};

interface ICollection {
	uuid: string,
	title: string,
	content: string,
}

export { Collection, ICollection, };