import { ICreateCollectionResponse } from '../../../Core/types/Response'
import { ExpressFinalCallback } from '../types/types';
import { randomUUID } from 'crypto';

const createCollectionsFn: ExpressFinalCallback = (req, res, next) => {

	const uuid = randomUUID();

	const payload: ICreateCollectionResponse = {
		success: true,
		newCollection: {
			title: uuid,
			content: 'content here',
			uuid,
		},
	};
	req.transaction.sendResponse(res, payload);
};

export default createCollectionsFn;