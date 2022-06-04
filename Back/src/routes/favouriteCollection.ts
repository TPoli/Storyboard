import { IFailResponse, IFavouriteCollectionResponse } from 'core'
import { PermissionsAR } from '../models';
import { ExpressFinalCallback } from '../types/types';
/**
 * Purpose:
 * to set the favourite status of a collection for the current user
 */
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

	const relatedPermissions = (await req.user.myPermissions()).find(permission => permission.collectionId === uuid);
	if (!relatedPermissions) {
		const payload: IFailResponse = {
			success: false,
			message: 'could not verify permission to modify collection.',
		};
		return req.transaction.sendResponse(res, req, payload);
	}

	// no change required
	if (req.body.favourite === relatedPermissions.favourite) {
		const payload: IFavouriteCollectionResponse = {
			success: true,
			collectionId: uuid,
			favourite: false,
		};
		return req.transaction.sendResponse(res, req, payload);
	}

	relatedPermissions.favourite = req.body.favourite;
	const success = await relatedPermissions.save<PermissionsAR>(req, [
		'favourite',
		'lastUpdated',
	]);

	if (success) {
		const payload: IFavouriteCollectionResponse = {
			success: true,
			collectionId: uuid,
			favourite: relatedPermissions.favourite,
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