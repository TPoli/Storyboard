import express from 'express';
import cors from 'cors';

import { Api } from '../Core/Api/Api'
import { Db } from './src/db';

const app = express();

const setupExpress = () => {
    const allowedOrigins = ['http://localhost:8080'];

    const corsOptions: cors.CorsOptions = {
        origin: allowedOrigins,
        optionsSuccessStatus: 200 // legacy support
    };

    app.use(cors(corsOptions));
    app.use(express.json());
};

const setupRoutes = () => {
    Object.entries(Api.AllEndpoints).forEach(([, endpoint]) => {
        endpoint.methods.forEach((method) => {
            if (method === 'GET') {
                app.get('/' + endpoint.route, (req, res) => {
                    console.log('GET');
                    res.send('Well done!');
                });
            } else if (method === 'POST') {
                app.post('/' + endpoint.route, (req, res) => {
                    console.log('POST');
                    res.send('Well done!');
                });
            }
        });
    });
};

const launchServer = () => {
    app.listen(Api.ServerPort, () => {
        console.log(`The application is listening on port ${Api.ServerPort}!`);
    });
};

const setupWebserver = () => {
    setupExpress();
    setupRoutes();
    launchServer();

    // make a model class that can map types to the outputs of queries
    const cb: Db.DbCallback = (error: any, results: any[], fields: any) => {
        console.log(results[0].id);
    };
    Db.execute('SELECT * from test_table;',[], cb)
};

const main = () => {
    Db.InitDb(setupWebserver);
};

main();
