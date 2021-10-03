import { Content } from "./Content";

/**
 * used to represent the hierarchy of content
 */
 interface Collection {
	id: number;
	name: string;
	siblingOrder: number;
	parent: Collection|null;
	children: Collection[];
	content: Content[];
};

export { Collection };