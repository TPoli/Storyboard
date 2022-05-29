import { ICreateCollectionResponse, IFailResponse } from '../../../Core/types/Response'
import { ExpressFinalCallback } from '../types/types';
import { CollectionAR } from '../models';
import { PermissionType } from '../../../Core/types/Models/Permissions';

const createCollectionsFn: ExpressFinalCallback = async (req, res) => {

	const collection = new CollectionAR({
		parentId: req.body.parentId,
	});

	const requestBody = req.body;

	collection.name = requestBody.name ?? collection.name;

	collection.data.description = requestBody.name ?? collection.name;

	if (requestBody.after) {
		// TODO implement when enabling ordering of children
		// should also change the method used by ordering to use direct references instead of number value
		// must check if user has permission to access the other collection
		// after meens that this is the sibling collection to be displayed/loaded after the referenced collection
		// if not provided and there is a sibling that meens that that one goes after this one
	}

	if (requestBody.parentId) {
		const myCollections = await req.user.myCollections();
		const availableCollections = await req.user.availableCollections();
		const permissions = await req.user.myPermissions();
		if (![...myCollections, ...availableCollections].find((availableCollection) => {
			const permission = permissions.find(p => p.collectionId = availableCollection.id);

			const allowedPermissions = [
				PermissionType.FULL,
				PermissionType.OWNER,
			];

			return permission && allowedPermissions.find(p => p === permission.permissionType);
		})) {
			// fail, cant set collections parent to collection user cant modify
			const payload: IFailResponse = {
				success: false,
				message: `could not set parent to ${req.body.parentId}`,
			};
			return req.transaction.sendResponse(res, req, payload);
		}
	}

	const success = await collection.save<CollectionAR>(req, [
		'id',
		'name',
		'before',
		'after',
		'parentId',
		'data',
	]);

	if (success) {
		const payload: ICreateCollectionResponse = {
			success: true,
			newCollection: {
				title: collection.name,
				content: collection.data?.content ?? '',
				uuid: collection.id,
				favourite: false,
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