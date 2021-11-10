const express = require('express');
import cors from 'cors';

import { Api, EndpointRoutes, Parameter } from '../Core/Api/Api'
import { Db } from './src/db';

import {
    AccountAR,
    TransactionsAR
} from './src/models';

import setupAuth from './src/security/authentication';
import { MinutesToMilliseconds } from '../Core/Utils/Utils';
import { Config } from './src/Config';
import { Routes } from './src/routes/router';
import { IAuthFailResponse, IFailResponse } from '../Core/types/Response';
import { ExpressCallback, LoggedInRequest } from './src/types/types';
import passport from 'passport';

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

const setupExpress = () => {
    let origin = `${Config.connectionProtocal}://${Config.siteUrl}`;
    if (Config.sitePort) {
        origin += `:${Config.sitePort}`;
    }
    const allowedOrigins = [
        origin,
    ];

    const corsOptions: cors.CorsOptions = {
        origin: allowedOrigins,
        optionsSuccessStatus: 200, // legacy support
        credentials: true,
    };

    app.use(cors(corsOptions));
    app.use(express.json());

    app.use(session({
        secret: 'temp secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: MinutesToMilliseconds(60),
            secure: false, // THIS NEEDS TO BE TRUE! only set to false for local testing
        },
    }));

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(passport.session());
};

const createLogMiddlware = (endpoint: EndpointRoutes) => {
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

const setupRoutes = () => {
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

        const logMiddleware = createLogMiddlware(endpoint.route);

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

setupAuth();

const serializeUserFn = (user: Express.User, done: Function) => {
    done(null, (user as AccountAR).id);
};

passport.serializeUser(serializeUserFn);
  
passport.deserializeUser(function(id: number, done: Function) {
    (new AccountAR).findOne({id: id,}, (error, account) => {
        if (error) {
            return done(null, false, { message: 'login failed.', });
        }
        if (!account) {
            return done(null, false, { message: 'login failed.', });
        }
        return done(null, account);
    });
});

const launchServer = () => {
    app.listen(Config.serverPort, () => {
        console.log(`The application is listening on port ${Config.serverPort}!`);
    });
};

const setupWebserver = () => {
    setupExpress();
    setupRoutes();
    launchServer();
};

const main = () => {
    Db.InitDb(setupWebserver);
};

main();
