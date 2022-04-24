import { ICollection } from '../../../Core/types/Collection';
import { IGetCollectionsPayload, IGetCollectionsResponse } from '../../../Core/types/Response'
import { CollectionAR } from '../models';
import { ExpressFinalCallback } from '../types/types';

const getChildCollections = async (availableCollections: CollectionAR[], parentId: string): Promise<CollectionAR[]> => {
	return availableCollections.filter((collection) => {
		return collection.parent === parentId;
	});
};

const TopLevelOnly = async (collections: CollectionAR[]): Promise<CollectionAR[]> => {
		const filtered: CollectionAR[] = [];
		let allCollections: CollectionAR[] = [];

		for (const collection of collections) {
			const {
				containsParent,
				allCollections: newAllCollections,
			} = await collection.ListContainsParent(collections, allCollections);
			allCollections = newAllCollections;

			if (!containsParent) {
				filtered.push(collection);
			}
		}
		
		return filtered;
};

const collectionModelToInterfaceFn = (favourites: CollectionAR[]) => (
	(relation: CollectionAR): ICollection => {
		return {
			title: relation.name,
			content: relation.data?.content ?? '',
			uuid: relation.id,
			favourite: !!favourites.find(favourite => favourite.id === relation.id),
		};
	}
);

const getCollectionsFn: ExpressFinalCallback = async (req, res) => {

	const requestedCollections: string[] = req.body.collections ?? [];

	const returnRecent = requestedCollections.indexOf('recentlyModified') >= 0;
	const returnMyCollections = requestedCollections.indexOf('myCollections') >= 0;
	const returnFavouriteCollections = requestedCollections.indexOf('favourites') >= 0;
	const returnAvailableCollections = requestedCollections.indexOf('availableCollections') >= 0;
	const returnChildCollections = !!(req.body.parentId ?? false);

	const myCollections = await req.user.myCollections();
	const favourites: CollectionAR[] =await req.user.myFavourites();
	
	const available: CollectionAR[] = (
		returnAvailableCollections || returnChildCollections
		? await req.user.availableCollections()
		: []
	);

	const children = (
		returnChildCollections
		? await getChildCollections(available, req.body.parentId)
		: []
	);

	const collectionsPayload: IGetCollectionsPayload = {};

	if (returnRecent) {
		const recentCollections = await req.user.myRecentCollections();
		collectionsPayload.recentlyModified = recentCollections.map(collectionModelToInterfaceFn(favourites));
	}

	if (returnMyCollections) {
		collectionsPayload.myCollections = (await TopLevelOnly(myCollections)).map(collectionModelToInterfaceFn(favourites));
	}

	if (returnFavouriteCollections) {
		collectionsPayload.favourites = favourites.map(collectionModelToInterfaceFn(favourites));
	}

	if (returnAvailableCollections) {
		const unownedButAvailable = (await TopLevelOnly(available)).filter(collection => collection.account !== req.user.id);
		collectionsPayload.availableCollections = unownedButAvailable.map(collectionModelToInterfaceFn(favourites));
	}

	if (returnChildCollections) {
		collectionsPayload.childCollections = children.map(collectionModelToInterfaceFn(favourites));
	}

	const payload: IGetCollectionsResponse = {
		success: true,
		message: 'Well done!',
		collections: collectionsPayload,
	};
	
	req.transaction.sendResponse(res, req, payload);
};

export default getCollectionsFn;