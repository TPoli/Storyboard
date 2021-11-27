import { IFailResponse, ISaveCollectionResponse } from '../../../Core/types/Response'
import { ExpressFinalCallback } from '../types/types';
import { randomUUID } from 'crypto';
import { AccountAR, CollectionAR } from '../models';

const findCollection = async (uuid: string, user: AccountAR): Promise<CollectionAR | null> => {
	const myCollections = await user.myCollections();
	const myCollection = myCollections.find(collection => collection.id === uuid);
	
	if (myCollection) {
		return myCollection;
	}

	const availableCollections = await user.availableCollections();

	return availableCollections.find(collection => collection.id === uuid) ?? null;
}

const saveCollectionsFn: ExpressFinalCallback = async (req, res) => {

	let collection: CollectionAR|null = null;
	if (req.body.uuid) {
		const uuid = req.body.uuid;

		collection = await findCollection(uuid, req.user);

		if (!collection) {
			const response: IFailResponse = {
				success: false,
				message: 'collection not found or insufficient permissions to modify it.',
			} 
			
			return req.transaction.sendResponse(res, req, response);
		}
	} else {
		const uuid = randomUUID();
		collection = new CollectionAR();
		collection.id = uuid;
		collection.account = req.user.id;
	}

	if (req.body.parentId) {
		const parent = findCollection(req.body.parentId, req.user);
		
		if (!parent) {
			// fail, cant set collections parent to invalid collection
			const payload: IFailResponse = {
				success: false,
				message: `could not set parent to ${req.body.parentId}`,
			};
			return req.transaction.sendResponse(res, req, payload);
		}

		collection.parent = req.body.parentId;
	}

	collection.data = {
		content: req.body.content ?? '',
	};
	collection.name = req.body.title ?? collection.name;

	const success = await collection.save(req, [
		'id',
		'account',
		'name',
		'siblingOrder',
		'parent',
		'data',
	]);

	if (success) {
		const payload: ISaveCollectionResponse = {
			success: true,
			message: 'Collection Saved',
		};
		return req.transaction.sendResponse(res, req, payload);
	}
	const payload: IFailResponse = {
		success: false,
		message: 'db failed to save',
	};
	return req.transaction.sendResponse(res, req, payload);
};

export default saveCollectionsFn;