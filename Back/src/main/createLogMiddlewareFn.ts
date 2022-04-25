import { EndpointRoutes } from '../../../Core/Api/Api';
import { IFailResponse } from '../../../Core/types/Response';
import { TransactionsAR } from '../models';
import { houseAccountId } from '../models/accountAR';
import { ExpressCallback, LoggedInRequest } from '../types/types';

const createLogMiddlewareFn = (endpoint: EndpointRoutes) => {
    const middleware: ExpressCallback = async (req, res, next) => {
        const transaction = new TransactionsAR({
            params: req.body,
            response: {},
            route: endpoint,
            accountId: houseAccountId,
            ipAddress: req.ip,
        });
        
        (req as LoggedInRequest).transaction = transaction;
        const success = await transaction.save<TransactionsAR>((req as LoggedInRequest), [
            'id',
            'accountId',
            'route',
            'params',
            'response',
            'ipAddress',
        ]);

        if (success) {
            next();
        } else {
            const response: IFailResponse = {
                message: 'faled to process request',
                success: false,
            };
            res.send(response);
        }
    };
    return middleware;
};

export { createLogMiddlewareFn };
