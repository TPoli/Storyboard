var express = require('express');
import cors from 'cors';

import { Api, Endpoints } from '../Core/Api/Api'
import { Db } from './src/db';

import Account from './src/models/account';
import { Session } from 'inspector';

import login from './src/routes/login';
import createAccount from './src/routes/createAccount';
import Storyboard from './src/storyboard';
import setupAuth from './src/security/authentication';
import { MinutesToMilliseconds } from '../Core/Utils/Utils';

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require("express-session");

const app = express();

const authenticationMiddleware = (req: any, res: any, next: any) => {
    if (req.user) {
        return next()
    }
    res.send({status: 'failure', reason: 'not logged in'});
};

const setupExpress = () => {
    const allowedOrigins = ['http://localhost:8080'];

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
                app.get('/' + endpoint.route, authenticationMiddleware, (req: any, res: any) => {
                    res.send('Well done!');
                });
            } else if (method === 'POST') {
                app.post('/' + endpoint.route, authenticationMiddleware, (req: any, res: any) => {
                    res.send('Well done!');
                });
            }
        });
    });

    app.post('/' + Endpoints.LOGIN, login);

    app.post('/' + Endpoints.CREATE_ACCOUNT, createAccount);
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

// app.get('/logout', function(req: any, res){
//     req.logout();
//     res.redirect('/');
// });

const launchServer = () => {
    app.listen(Api.ServerPort, () => {
        console.log(`The application is listening on port ${Api.ServerPort}!`);
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
