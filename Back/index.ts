import cors from 'cors';

import { InitDb } from './src/db';

import {
    AccountAR,
    Model,
} from './src/models';

import { setupAuth } from './src/security/authentication';
import { MinutesToMilliseconds } from 'core';
import { Config } from './src/Config';
import passport from 'passport';
import { setupRoutesFn } from './src/main';
import { getSessionStore } from './src/main/sessionStore';

const express = require('express');

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
        secret: 'temp secret', //TODO make this something better
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: MinutesToMilliseconds(60),
            secure: false, // TODO THIS NEEDS TO BE TRUE! only set to false for local testing
        },
        store: getSessionStore(session),
    }));

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(passport.session());
};

const serializeUserFn = (user: Express.User, done: Function) => {
    done(null, (user as AccountAR).id);
};

passport.serializeUser(serializeUserFn);
  
passport.deserializeUser(async function(id: number, done: Function) {
    const account = await Model.findOne<AccountAR>(AccountAR, {id});
    if (!account) {
        return done(null, false, { message: 'login failed.', });
    }

    return done(null, account);
});

const launchServer = () => {
    app.listen(Config.serverPort, () => {
        console.log(`The application is listening on port ${Config.serverPort}!`);
    });
};

const setupWebserver = async () => {
    setupExpress();
    await setupAuth();
    setupRoutesFn(app);
    launchServer();
};

const main = async () => {
    await InitDb();
    await setupWebserver();
};

main();
