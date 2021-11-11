const express = require('express');
import cors from 'cors';

import { Db } from './src/db';

import {
    AccountAR
} from './src/models';

import setupAuth from './src/security/authentication';
import { MinutesToMilliseconds } from '../Core/Utils/Utils';
import { Config } from './src/Config';
import passport from 'passport';
import { setupRoutesFn } from './src/main';

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

const serializeUserFn = (user: Express.User, done: Function) => {
    done(null, (user as AccountAR).id);
};

passport.serializeUser(serializeUserFn);
  
passport.deserializeUser(async function(id: number, done: Function) {
    const account = await (new AccountAR).findOne({id: id,});
    if (!account) {
        return done(null, false, { message: 'login failed.', });
    }
    account.init();
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

const main = () => {
    Db.InitDb(setupWebserver);
};

main();
