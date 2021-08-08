import express from 'express';
import cors from 'cors';

import { Api } from '../Core/Api/Api'

const app = express();

const allowedOrigins = ['http://localhost:8080'];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200 // legacy support
};

app.use(cors(corsOptions));
app.use(express.json());

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

app.listen(Api.ServerPort, () => {
    console.log(`The application is listening on port ${Api.ServerPort}!`);
});