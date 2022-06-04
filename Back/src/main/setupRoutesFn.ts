import { createLogMiddlewareFn } from '.';
import { IFailResponse, IAuthFailResponse, Api, Parameter } from 'core';
import { Routes } from '../routes/router';
import { ExpressCallback, LoggedInRequest } from '../types/types';

const setupRoutesFn = (app: any) => {
    Object.entries(Api.AllEndpoints).forEach(([, endpoint]) => {

        // build middleware that validates parameters and calls any additional middleware
        const middleware: ExpressCallback = (req, res, next) => {
            const validatedBody: any = {};
            endpoint.params.forEach((param: Parameter) => {
                const value = req?.body[param.name] ?? null;

                if (value === null) {
                    if (!param.required) {
                        return;
                    } else {
                        const errorMessage = `missing required param ${param.name}`;
                        console.log(errorMessage);
                        const responseData: IFailResponse = {
                            message: errorMessage,
                            success: false,
                        };
                        res.send(responseData);
                        return;
                    }
                }
                
                if (param.isArray) {
                    let errorMessage = null;
                    for (let i = 0; i < value.length; ++i) {
                        errorMessage = param.validator(value[i], param.name);
                        if (errorMessage) {
                            break;
                        }
                    }
                    
                    if (errorMessage) {
                        console.log(errorMessage);
                        const responseData: IFailResponse = {
                            message: errorMessage,
                            success: false,
                        };
                        res.send(responseData);
                        return;
                    }
                } else {
                    const errorMessage = param.validator(value, param.name);
                    if (errorMessage) {
                        console.log(errorMessage);
                        const responseData: IFailResponse = {
                            message: errorMessage,
                            success: false,
                        };
                        res.send(responseData);
                        return;
                    }
                }
                
                validatedBody[param.name] = value;
            });

            // after this point only validated parameters are available
            req.body = validatedBody;

            if (endpoint.middleware) {
                endpoint.middleware(req, res, next);
            } else {
                next();
            }
        };

        const logMiddleware = createLogMiddlewareFn(endpoint.route);

        const checkAuthenticatedMiddleware: ExpressCallback = (req: LoggedInRequest, res, next) => {
            const transaction = req.transaction;
            if (req.isAuthenticated()) {
                return next();
            }
            const payload: IAuthFailResponse = {
                success: false,
                message: 'authentication failed',
            };
            return transaction.sendResponse(res, req, payload);
        }

        const middlewares = [
            logMiddleware,
            middleware,
            Routes[endpoint.route].callback,
        ];

        if (Routes[endpoint.route].authenticatedUserRequired) {
            middlewares.splice(1,0, checkAuthenticatedMiddleware);
        }
        
        endpoint.methods.forEach((method) => {
            if (method === 'GET') {
                app.get('/' + endpoint.route, ...middlewares);
            } else if (method === 'POST') {
                app.post('/' + endpoint.route, ...middlewares);
            }
        });
    });
};

export { setupRoutesFn };