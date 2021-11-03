import { IGetCollectionsResponse } from '../../../Core/types/Response'
import { ExpressFinalCallback } from '../types/types';
import { randomUUID } from 'crypto';

const getCollectionsFn: ExpressFinalCallback = (req, res, next) => {
	const payload: IGetCollectionsResponse = {
		success: true,
		message: 'Well done!',
		collections: {
			recentlyModified:[
				{
					title: 'R1',
					content: 'Recent-1',
					uuid: 'randomUUID()',
				}, {
					title: 'R2',
					content: 'Recent-2',
					uuid: 'randomUUID()',
				}, {
					title: 'R3',
					content: 'Recent-3',
					uuid: 'randomUUID()',
				}, 
			],
		},
		
		// 'myCollections',
		// 'favourites',
		// 'availableCollections',
		// TODO stop hard coding the above
	};
	req.transaction.sendResponse(res, payload);
};

export default getCollectionsFn;