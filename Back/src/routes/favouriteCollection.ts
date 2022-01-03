import { randomUUID } from 'crypto';

import { IFailResponse, IFavouriteCollectionResponse } from '../../../Core/types/Response'
import { ExpressFinalCallback } from '../types/types';
import { FavouritesAR } from '../models';

const favouriteCollectionFn: ExpressFinalCallback = async (req, res) => {

	const uuid = req.body.uuid;

	const collection = (await req.user.getCollectionById(uuid));

	if (!collection) {
		const payload: IFailResponse = {
			success: false,
			message: 'could not access collection',
		};

		return req.transaction.sendResponse(res, req, payload);
	}

	const existingFavourites = await req.user.myFavourites();
	
	const existingFavourite = existingFavourites.find(favourite => favourite.collectionId === uuid);

	if (!req.body.favourite) {
		if (!existingFavourite) {
			const payload: IFailResponse = {
				success: false,
				message: 'Can\'t unfavourite - not marked as favourite.',
				footerError: 'Can\'t unfavourite - not marked as favourite.',
			};
			return req.transaction.sendResponse(res, req, payload);
		}

		const deleted = await existingFavourite.delete(req);

		if (deleted) {
			const payload: IFavouriteCollectionResponse = {
				success: true,
				collectionId: uuid,
				favourite: false,
			};
			return req.transaction.sendResponse(res, req, payload);
		}
		const payload: IFailResponse = {
			success: false,
			message: 'db failed to save',
		};
		return req.transaction.sendResponse(res, req, payload);
	}

	if (existingFavourite) {
		const payload: IFailResponse = {
			success: false,
			message: 'Can\'t favourite - already marked as favourite.',
			footerError: 'Can\'t favourite - already marked as favourite.',
		};
		return req.transaction.sendResponse(res, req, payload);
	}

	const newFavourite = new FavouritesAR();
	newFavourite.accountId = req.user.id;
	newFavourite.collectionId = uuid;
	newFavourite.id = randomUUID();
		
	const success = await newFavourite.save(req, [
		'id',
		'accountId',
		'collectionId',
	]);

	if (success) {
		const payload: IFavouriteCollectionResponse = {
			success: true,
			collectionId: uuid,
			favourite: true,
		};
		return req.transaction.sendResponse(res, req, payload);
	}
	const payload: IFailResponse = {
		success: false,
		message: 'db failed to save',
	};
	return req.transaction.sendResponse(res, req, payload);
};

export default favouriteCollectionFn;