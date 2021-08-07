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

Api.AllEndpoints.forEach(endpoint => {
    app.get('/' + endpoint.route, (req, res) => {
        console.log('GET');
        res.send('Well done!');
        // req.
    });
    app.post('/' + endpoint.route, (req, res) => {
        console.log('POST');
        res.send('Well done!');
        // req.
    })
});


app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
});