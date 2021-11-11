import { createLogMiddlewareFn } from '.';
import { Api, Parameter } from '../../../Core/Api/Api';
import { IFailResponse, IAuthFailResponse } from '../../../Core/types/Response';
import { Routes } from '../routes/router';
import { ExpressCallback, LoggedInRequest } from '../types/types';

const setupRoutesFn = (app: any) => {
    Object.entries(Api.AllEndpoints).forEach(([, endpoint,]) => {

        // build middleware that validates parameters and calls any additional middleware
        const middleware: ExpressCallback = (req, res, next) => {
            const validatedBody: any = {};
            endpoint.params.forEach((param: Parameter) => {
                const value = req?.body[param.name] ?? null;
                if (!param.required && value === null) {
                    return;
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

        const checkAuthenticatedMiddleware: ExpressCallback = (req, res, next) => {
            if (req.isAuthenticated()) {
                return next()
            }
            const payload: IAuthFailResponse = {
                success: false,
                message: 'authentication failed',
            };
            return (req as LoggedInRequest).transaction.sendResponse(res, (req as LoggedInRequest), payload);
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