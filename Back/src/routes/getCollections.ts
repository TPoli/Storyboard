import { ICollection } from '../../../Core/types/Collection';
import { IGetCollectionsResponse } from '../../../Core/types/Response'
import { CollectionAR } from '../models';
import { ExpressFinalCallback } from '../types/types';

const getCollectionsFn: ExpressFinalCallback = async (req, res) => {

	const recentCollectionsModel = await req.user.recentCollections();

	const recent = await recentCollectionsModel?.collections() ?? [];
	const myCollections = await req.user.myCollections();

	const collectionModelToInterface = (relation: CollectionAR): ICollection => {
		return {
			title: relation.name,
			content: relation.data?.content ?? '',
			uuid: relation.id,
		};
	};

	const payload: IGetCollectionsResponse = {
		success: true,
		message: 'Well done!',
		collections: {
			recentlyModified: recent.map(collectionModelToInterface),
			myCollections: myCollections.map(collectionModelToInterface),
		},
	};
	
	req.transaction.sendResponse(res, req, payload);
};

export default getCollectionsFn;