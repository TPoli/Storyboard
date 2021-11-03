import { Collection } from "./Collection";

/**
 * used to represent the actual content
 */
interface Content {
	id: number;
	name: string;
	siblingOrder: number;
	parent: Collection|null;
	data: ContentData;
};

interface ContentData {

}

export { Content, ContentData };