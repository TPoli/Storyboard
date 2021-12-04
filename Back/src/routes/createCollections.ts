import { ICreateCollectionResponse, IFailResponse } from '../../../Core/types/Response'
import { ExpressFinalCallback } from '../types/types';
import { randomUUID } from 'crypto';
import { CollectionAR } from '../models';

const createCollectionsFn: ExpressFinalCallback = async (req, res) => {

	const uuid = randomUUID();
	const collection = new CollectionAR();
	collection.account = req.user.id;

	if (req.body.parentId) {
		const myCollections = await req.user.myCollections();
		const availableCollections = await req.user.availableCollections();
		if (![...myCollections, ...availableCollections,].find((availableCollection) => {
			return (availableCollection.account === req.user.id);
		})) {
			// fail, cant set collections parent to invalid collection
			const payload: IFailResponse = {
				success: false,
				message: `could not set parent to ${req.body.parentId}`,
			};
			return req.transaction.sendResponse(res, req, payload);
		}
	}

	collection.id = uuid;
	collection.parent = req.body.parentId;
	collection.data = {
		content: '',
	};

	const success = await collection.save(req, [
		'id',
		'account',
		'name',
		'siblingOrder',
		'parent',
		'data',
	]);

	if (success) {
		const payload: ICreateCollectionResponse = {
			success: true,
			newCollection: {
				title: collection.name,
				content: collection.data?.content ?? '',
				uuid: collection.id + '',
			},
		};
		return req.transaction.sendResponse(res, req, payload);
	}
	const payload: IFailResponse = {
		success: false,
		message: 'db failed to save',
	};
	return req.transaction.sendResponse(res, req, payload);
};

export default createCollectionsFn;