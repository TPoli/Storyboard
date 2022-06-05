import { IFailResponse, EndpointRoutes } from 'core';
import { TransactionsAR } from '../models';
import { houseAccountId } from '../models/accountAR';
import { ExpressCallback, LoggedInRequest } from '../types/types';

const createLogMiddlewareFn = (endpoint: EndpointRoutes) => {
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
