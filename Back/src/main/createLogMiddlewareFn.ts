import { EndpointRoutes } from "../../../Core/Api/Api";
import { IFailResponse } from "../../../Core/types/Response";
import { TransactionsAR } from "../models";
import { ExpressCallback, LoggedInRequest } from "../types/types";

const createLogMiddlewareFn = (endpoint: EndpointRoutes) => {
    const middleware: ExpressCallback = async (req, res, next) => {
        const transaction = new TransactionsAR();
        transaction.params = req.body;
        transaction.response = {};
        transaction.route = endpoint;
        transaction.account = 1; // house account
        transaction.ipAddress = req.ip;
        
        (req as LoggedInRequest).transaction = transaction;
        const success = await transaction.save((req as LoggedInRequest), [
            'account',
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
