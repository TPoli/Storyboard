import * as express from 'express';

export type ExpressCallback = (req: express.Request, res: express.Response, next: express.NextFunction) => void;