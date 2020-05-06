import * as cls from 'cls-hooked';
import * as uuid from 'node-uuid';
import * as express from 'express';
import * as Debug from 'debug';

const debug = Debug('app:src:lib:namespace');

const getNamespace = cls.getNamespace;
const createNamespace = cls.createNamespace;
const NAMESPACE: string = 'SOS';
export const REQ_NAME: string = 'X-Request-Id';
export const request = createNamespace(NAMESPACE);

export function getRequestId(): string {
  const myRequest = getNamespace(NAMESPACE);
  if (myRequest && myRequest.get(REQ_NAME)) {
    return myRequest.get(REQ_NAME);
  }
  return undefined;
}

export async function setRequestId(req: express.Request, res: express.Response, next: express.NextFunction): Promise <any> {
  req[REQ_NAME] = req[REQ_NAME] || req.get(REQ_NAME) || req.query[REQ_NAME] || uuid.v4();
  req.requestId = req[REQ_NAME];
  res.setHeader(REQ_NAME, req[REQ_NAME]);
  debug('Response requestId set as: ', res.getHeader(REQ_NAME));
  debug('Store UUID, add it to the request');
  request.run(function() {
    request.set(REQ_NAME, req[REQ_NAME]);
    debug('CLS, requestId added as:', req[REQ_NAME]);
    next();
  });
}
