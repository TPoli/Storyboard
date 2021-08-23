var express = require('express');
import cors from 'cors';
import { Passport } from 'passport';
import { Strategy } from 'passport-local';

import { Api, Endpoints } from '../Core/Api/Api'
import { Db } from './src/db';

import Account from './src/models/account';
import { Session } from 'inspector';
import { IAccountFailResponse } from '../Core/types/Response';

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require("express-session");

const bcrypt = require('bcrypt');

const passport = new Passport();

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
    app.use(passport.initialize());
    app.use(passport.session());
};

const setupRoutes = () => {
    Object.entries(Api.AllEndpoints).forEach(([, endpoint]) => {
        endpoint.methods.forEach((method) => {
            if (method === 'GET') {
                app.get('/' + endpoint.route, authenticationMiddleware, (req: any, res: any) => {
                    console.log('GET');
                    res.send('Well done!');
                });
            } else if (method === 'POST') {
                app.post('/' + endpoint.route, authenticationMiddleware, (req: any, res: any) => {
                    console.log('POST');
                    // console.log(JSON.stringify(Object.keys(req)));
                    console.log(JSON.stringify(req.user))
                    res.send('Well done!');
                });
            }
        });
    });

    app.post('/login', (req: any, res: any, next: any) => {
        console.log('POST: login');

        const login = (user: any, loginErr: any) => {
            if (loginErr) {
                console.log('error');
                return next(loginErr);
            }
            return res.send({ success : true, message : 'authentication succeeded' });
        };

        passport.authenticate('login', {session: true}, (err, user, info) => {
            if (err) {
                return next(err); // will generate a 500 error
            }
            if (! user) {
                return res.send({ success : false, message : 'authentication failed' }); // use IResponse, AuthFailResponse
            }
            console.log('authenticated');
            req.login(user, login); // not called automatically due to custom callback
        })(req, res, next);

        // res.send('Well done!');
    });

    app.post('/' + Endpoints.CREATE_ACCOUNT, (req: any, res: any, next: any) => {
        console.log('POST: createAccount');

        const login = (user: any, loginErr: any) => {
            if (loginErr) {
                console.log('error');
                return next(loginErr);
            }
            return res.send({ success : true, message : 'account created' });
        };

        passport.authenticate('createAccount', {session: true}, (err, user, info) => {
            if (err) {
                return next(err); // will generate a 500 error
            }
            if (! user) {
                return res.send({ success : false, message : 'account creation failed' } as IAccountFailResponse);
            }
            req.login(user, login); // not called automatically due to custom callback
        })(req, res, next);
    });
};


const createAccount = (username:any, password:any, done:any) => {
    console.log('verifing: createAccount');

    const account = new Account();
    account.permissions = {};
    account.username = username;

    const refreshed = () => {
        return done(null, account);
    };
    const saved = (success: boolean) => {
        if (success) {
            account.refresh(refreshed);
        } else {
            return done(null, false, { message: 'login failed.' });
        }
    };

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function(err: Error, hash: string) {
        if (err) {
            return done(null, false, { message: 'login failed.' });
        }
        account.password = hash;
        account.save(saved, [
            'username',
            'password',
            'permissions',
        ]);
    });
};

const verifyUser = (username:any, password:any, done:any) => {
    console.log('verifing');

    const account = new Account();
    account.id = 1;
    account.permissions = {};
    account.username = 'bob';
    return done(null, account);

    // (new Account).findOne({username: username}, (error: Error, account: Account|null) => {
    //     if (error) {
    //         return done(null, false, { message: 'login failed.' });
    //     }
    //     if (!account) {
    //         return done(null, false, { message: 'login failed.' });
    //     }

    //     const saltRounds = 10;
    //     bcrypt.hash(password, saltRounds, function(err: Error, hash: string) {
    //         if (err) {
    //             return done(null, false, { message: 'login failed.' });
    //         }
    //         if (account.password === hash) {
    //             return done(null, account);
    //         } else {
    //             return done(null, false, { message: 'login failed.' });
    //         }
    //     });
    // });
};

passport.use('login', new Strategy({
    usernameField: 'un',
    passwordField: 'pw',
    session: true
}, verifyUser));

passport.use('createAccount', new Strategy({
    usernameField: 'un',
    passwordField: 'pw',
    session: true
}, createAccount));

passport.serializeUser(function(user, done) {
    const session = new Session()
    // console.log(JSON.stringify(user));
    done(null, 1);
});
  
passport.deserializeUser(function(id, done) {

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
