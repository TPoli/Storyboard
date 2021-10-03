import { Collection } from "./Collection";

/**
 * used to represent the actual content
 */
interface Content {
	id: number;
	name: string;
	siblingOrder: number;
	parent: Collection|null;
	data: any; // this will need to change later to a specific type (must be a object)
};

export { Content };