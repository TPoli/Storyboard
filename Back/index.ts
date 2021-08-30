var express = require('express');
import cors from 'cors';

import { Api, Endpoints } from '../Core/Api/Api'
import { Db } from './src/db';

import Account from './src/models/account';
import { Session } from 'inspector';
import { IAccountFailResponse } from '../Core/types/Response';

import login from './src/routes/login';
import Storyboard from './src/storyboard';
import setupAuth from './src/security/authentication';

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
        saveUninitialized: false
    }))

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

    app.post('/login', login);

    app.post('/' + Endpoints.CREATE_ACCOUNT, (req: any, res: any, next: any) => {
        const loginCallback = (user: any, loginErr: any) => {
            if (loginErr) {
                console.log('error');
                return next(loginErr);
            }
            return res.send({ success : true, message : 'account created' });
        };

        Storyboard.Instance().passport.authenticate('createAccount', {session: true}, (err: Error, user: Account, info: any) => {
            if (err) {
                return next(err); // will generate a 500 error
            }
            if (! user) {
                return res.send({ success : false, message : 'account creation failed' } as IAccountFailResponse);
            }
            req.login(user, loginCallback); // not called automatically due to custom callback
        })(req, res, next);
    });
};

setupAuth();

Storyboard.Instance().passport.serializeUser(function(user: Account, done: any) {
    const session = new Session()
    done(null, 1);
});
  
Storyboard.Instance().passport.deserializeUser(function(id: number, done: any) {

    const account = new Account();
    account.id = 1;
    account.permissions = {};
    account.username = 'bob';
    done(null, account);
    // User.findById(id, function(err, user) {
    //     done(err, user);
    // });
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
