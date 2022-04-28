import { Collection } from '../../../../Core/types/Collection';
import { Model } from '../model';
import { CollectionModel } from './collectionModel';
import { CollectionsParams } from './types';

export class CollectionAR extends CollectionModel implements Collection {

	public children: string[] = [];
	
	/**
	 * recursive helper function to test if provided array contains this collections parent, grandparent etc.
	 * 
	 * @param collections 
	 * @param allCollections use this if multiple checks are needed to prevent wasted queries
	 */
	public async ListContainsParent(collections: CollectionAR[], allCollections: CollectionAR[] = []): Promise<{
		containsParent: boolean,
		allCollections: CollectionAR[],
	}> {
		if (!this.parentId) {
			return {
				containsParent: false,
				allCollections,
			};
		}

		const directMatch = collections.find(collection => {
			return collection.id === this.parentId;
		});

		if (directMatch) {
			return {
				containsParent: true,
				allCollections,
			};
		}

		let parent: CollectionAR|undefined|null = allCollections.find(collection => {
			return collection.id === this.parentId;
		});

		if (!parent) {
			parent = await Model.findOne<CollectionAR>(CollectionAR, {id: this.parentId}) as CollectionAR|null;
			if (parent) {
				allCollections.push(parent);
			}
		}

		return parent?.ListContainsParent(collections, allCollections) ?? {
			containsParent: false,
			allCollections,
		};
	}

	constructor(params: CollectionsParams) {
		super(params);
	}
}