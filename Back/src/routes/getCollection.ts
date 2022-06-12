import { IFailResponse, IGetCollectionResponse } from 'core';
import { CollectionAR } from '../models';
import { ExpressFinalCallback } from '../types/types';

const collectionModelToInterface = (collection: CollectionAR, favourites: CollectionAR[]) => {
	return {
		title: collection.name,
		content: collection.data?.content ?? '',
		uuid: collection.id,
		favourite: !!favourites.find(favourite => favourite.id === collection.id),
	};
};

const getCollectionFn: ExpressFinalCallback = async (req, res) => {
	const availableCollections = await req.user.availableCollections();

	const collection = availableCollections.find(collection => collection.id === req.body.collectionId);

	if (!collection) {
		const payload: IFailResponse = {
			success: false,
			message: 'could not access collection',
		};

		return req.transaction.sendResponse(res, req, payload);
	}

	const favourites: CollectionAR[] =await req.user.myFavourites();
	const payload: IGetCollectionResponse = {
		success: true,
		message: 'Well done!',
		collection: collectionModelToInterface(collection, favourites),
	};
	
	req.transaction.sendResponse(res, req, payload);
};

export {
	getCollectionFn,
}
