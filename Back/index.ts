const express = require('express');
import cors from 'cors';

import { Api, EndpointRoutes, Parameter } from '../Core/Api/Api'
import { Db } from './src/db';

import AccountAR from './src/models/accountAR';
import TransactionsAR from './src/models/transactionsAR';
import { Session } from 'inspector';

import Storyboard from './src/storyboard';
import setupAuth from './src/security/authentication';
import { MinutesToMilliseconds } from '../Core/Utils/Utils';
import { Config } from './src/Config';
import { Routes } from './src/routes/router';
import { IFailResponse } from '../Core/types/Response';
import { ExpressCallback, LoggedInRequest } from './src/types/types';

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
    app.use(Storyboard.Instance().passport.initialize());
    app.use(Storyboard.Instance().passport.session());
};

const createLogMiddlware = (endpoint: EndpointRoutes) => {
    const middleware: ExpressCallback = (req, res, next) => {
        const saved = (success: boolean) => {
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

        const transaction = new TransactionsAR();
        transaction.params = req.body;
        transaction.response = {};
        transaction.route = endpoint;
        transaction.account = 1; // house account
        transaction.ipAddress = req.ip;
        
        (req as LoggedInRequest).transaction = transaction;
        transaction.save(saved, [
            'account',
            'route',
            'params',
            'response',
            'ipAddress',
        ]);
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
        
        endpoint.methods.forEach((method) => {
            if (method === 'GET') {
                app.get('/' + endpoint.route, logMiddleware, middleware, Routes[endpoint.route].callback);
            } else if (method === 'POST') {
                app.post('/' + endpoint.route, logMiddleware, middleware, Routes[endpoint.route].callback);
            }
        });
    });
};

setupAuth();

Storyboard.Instance().passport.serializeUser(function(user: AccountAR, done: any) {
    const session = new Session()
    done(null, user.id);
});
  
Storyboard.Instance().passport.deserializeUser(function(id: number, done: any) {
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
