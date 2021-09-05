var express = require('express');
import cors from 'cors';

import { Api, Endpoints } from '../Core/Api/Api'
import { Db } from './src/db';

import Account from './src/models/account';
import { Session } from 'inspector';

import Storyboard from './src/storyboard';
import setupAuth from './src/security/authentication';
import { MinutesToMilliseconds } from '../Core/Utils/Utils';
import { Config } from './src/Config';
import { Routes } from './src/routes/router';

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require("express-session");

const app = express();

const setupExpress = () => {
    let origin = `${Config.connectionProtocal}://${Config.siteUrl}`;
    if (Config.sitePort) {
        origin += `:${Config.sitePort}`;
    }
    const allowedOrigins = [
        origin
    ];

    const corsOptions: cors.CorsOptions = {
        origin: allowedOrigins,
        optionsSuccessStatus: 200, // legacy support
        credentials: true
    };

    app.use(cors(corsOptions));
    app.use(express.json());

    app.use(session({
        secret: 'temp secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: MinutesToMilliseconds(60),
            secure: false // THIS NEEDS TO BE TRUE! only set to false for local testing
        }
    }));

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(Storyboard.Instance().passport.initialize());
    app.use(Storyboard.Instance().passport.session());
};

const setupRoutes = () => {
    Object.entries(Api.AllEndpoints).forEach(([, endpoint]) => {
        endpoint.methods.forEach((method) => {
            if (method === 'GET') {
                if (endpoint.middleware) {
                    app.get('/' + endpoint.route, endpoint.middleware, Routes[endpoint.route]);
                } else {
                    app.get('/' + endpoint.route, Routes[endpoint.route]);
                }
            } else if (method === 'POST') {
                if (endpoint.middleware) {
                    app.post('/' + endpoint.route, endpoint.middleware, Routes[endpoint.route]);
                } else {
                    app.post('/' + endpoint.route,Routes[endpoint.route]);
                }
            }
        });
    });
};

setupAuth();

Storyboard.Instance().passport.serializeUser(function(user: Account, done: any) {
    const session = new Session()
    done(null, user.id);
});
  
Storyboard.Instance().passport.deserializeUser(function(id: number, done: any) {
    (new Account).findOne({id: id}, (error: Error, account: Account|null) => {
        if (error) {
            return done(null, false, { message: 'login failed.' });
        }
        if (!account) {
            return done(null, false, { message: 'login failed.' });
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
