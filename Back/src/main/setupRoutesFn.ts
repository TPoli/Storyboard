import { createLogMiddlewareFn } from '.';
import { GenericObject } from 'core';
import { IFailResponse, IAuthFailResponse } from 'storyboard-networking';
import { ExpressCallback, LoggedInRequest } from '../types/types';
import { endpointHandlers } from './routeHandlerMap';
import { AllRoutes, Route, RouteTypes, Parameter } from 'storyboard-networking';

const setupRoutesFn = (app: any) => {
    AllRoutes.map((r: Route) => {
        const logMiddleware = createLogMiddlewareFn(r.path);
        const middlewares = [
            logMiddleware,
        ];

        if (r.authenticatedUserRequired) {
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
            middlewares.push(checkAuthenticatedMiddleware);
        }

        const validationMiddleware: ExpressCallback = (req, res, next) => {
            const validatedBody: GenericObject = {};
            r.params.forEach((param: Parameter) => {
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

            next();
        };

        middlewares.push(validationMiddleware);

        middlewares.push(endpointHandlers[r.path]);
        // register route
        r.methods.forEach((method: RouteTypes) => {
            if (method === 'GET') {
                app.get('/' + r.path, ...middlewares);
            } else if (method === 'POST') {
                app.post('/' + r.path, ...middlewares);
            }
        });
    });
};

export { setupRoutesFn };