import express from 'express';

import { Entity } from '../Core/types/Entity'

const app = express();

const entity = new Entity('Location');

entity.move(5);

app.get('/', (req, res) => {
    res.send('Well done!');
})

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})