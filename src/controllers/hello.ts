import { Request, Response } from 'express';
import { TDebug } from '../log';
const log = require('debug-level').log('app:src:controllers:getHelloWorld1')

const debug = new TDebug('app:src:controllers:getHelloWorld');

export async function getHelloWorldGet(req: Request, res: Response): Promise<any> {
    const greeting =
    req.query && req.query.greeting ? req.query.greeting : 'World';
    debug.info('Greeting: ', {greeting:"test", "test":"fsd"});
    res.send({'msg': 'hello ' + greeting});
}

export async function getHelloWorldPost(req: Request, res: Response): Promise<any> {
    const greeting =
    req.body && req.body.greeting ? req.body.greeting : 'World';
    debug.info('Greeting: ', greeting);
    log.info('Greeting: ', {greeting:"test", "test":"fsd"}, "asdas");
    debug.info('Greeting: ', {greeting:"test", "test":"fsd"});
    res.send({'msg': 'hello ' + greeting});
}
