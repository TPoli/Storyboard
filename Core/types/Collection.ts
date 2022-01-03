
/**
 * used to represent the hierarchy of content
 */
 interface Collection {
	id: string;
	name: string;
	siblingOrder: number;
	parent: string|null;
	children: string[];
};

interface ICollection {
	uuid: string,
	title: string,
	content: string,
	favourite: boolean,
}

export { Collection, ICollection, };