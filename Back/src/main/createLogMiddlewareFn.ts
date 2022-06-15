import { IFailResponse } from 'storyboard-networking';
import { RouteNames } from 'storyboard-networking';
import { TransactionsAR } from '../models';
import { houseAccountId } from '../models/accountAR';
import { ExpressCallback, LoggedInRequest } from '../types/types';

const createLogMiddlewareFn = (endpoint: RouteNames) => {
    const middleware: ExpressCallback = async (req, res, next) => {
        const transaction = new TransactionsAR({
            params: req.body,
            response: { success: false },
            route: endpoint,
            accountId: houseAccountId,
            ipAddress: req.ip,
        });

        const loggedInReq = req as LoggedInRequest;
        
        loggedInReq.transaction = transaction;
        const success = await transaction.save<TransactionsAR>(loggedInReq, [
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
