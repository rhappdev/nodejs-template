import * as env from './env';
import { getRequestId } from './lib/cls';
import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';
import * as express from 'express';
import * as perfy from 'perfy';
import * as Log from 'debug-level';

const logLevel = env.get('LOG_LEVEL') ? env.get('LOG_LEVEL') : 'INFO';

Log.options({
  level: logLevel,
  json: false,
  serverinfo: true,
  hideDate: false,
  colors: true
});

export class TDebug {
  private debugLevel: any;

  constructor(namespace: string) {
    this.debugLevel = new Log(namespace);
  }

  public error(formatter: string, ...args: any) {
    this.debugLevel.error(this.formatter(formatter), ...args);
  }

  public warn(formatter: string, ...args: any) {
    this.debugLevel.warn(this.formatter(formatter), ...args);
  }

  public info(formatter: string, ...args: any) {
    this.debugLevel.info(this.formatter(formatter), ...args);
  }

  public debug(formatter: string, ...args: any) {
    this.debugLevel.debug(this.formatter(formatter), ...args);
  }

  public fatal(formatter: string, ...args: any) {
    this.debugLevel.fatal(this.formatter(formatter), ...args);
  }

  public start(label: string) {
    perfy.start(getRequestId() + '.' + label);
  }

  public end(label: string) {
    const selector = getRequestId() + '.' + label;
    if (perfy.exists(selector)) {
      const result = perfy.end(getRequestId() + '.' + label);
      this.debugLevel.info(`${label} executed in ${result.time} sec.`);
    }
  }

  private formatter(formatter: string): string {
    return getRequestId() ? getRequestId() + ' ' + formatter  : formatter;
  }
}

const debug = new TDebug('app:src:lib:log');

export interface RequestLog {
  method: string;
  originalUrl: string;
  requestId: string;
  headers: IncomingHttpHeaders;
  params: any;
  extra?: any;
}
export interface ResponseLog {
  statusCode: number;
  contentLength: number;
  statusMessage: string;
  contentType: string;
  body?: any;
  headers?: OutgoingHttpHeaders;
}

export async function inOutLogger(req: express.Request, res: express.Response, next: express.NextFunction): Promise <any> {
  const reqLog = {
    method : req.method,
    originalUrl: req.originalUrl,
    requestId: req.requestId,
    headers: req.headers,
    params: req.query
  } as RequestLog;
  debug.debug('Incoming Request: %O', reqLog);

  const oldWrite = res.write;
  const oldEnd = res.end;

  const chunks = [];

  res.write = (...restArgs): boolean => {
    if (restArgs[0] && chunks.length === 0) {
      chunks.push(Buffer.from(restArgs[0]));
    }
    oldWrite.apply(res, restArgs);
    return true;
  };

  res.end = (...restArgs) => {
    if (restArgs[0]) {
      chunks.push(Buffer.from(restArgs[0]));
    }
    oldEnd.apply(res, restArgs);
    logFn();
  };

  const cleanup = () => {
    res.removeListener('close', abortFn);
    res.removeListener('error', errorFn);
  };

  const logFn = () => {
    cleanup();
    const body = Buffer.concat(chunks).toString('utf8');
    const resLog = {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      contentLength: res.get('Content-Length') || 0,
      contentType: res.get('Content-Type'),
      body,
      headers: res.getHeaders ? res.getHeaders() : undefined // Added in 7.7.0
    } as ResponseLog;
    if (resLog.statusCode >= 500) {
      debug.error('Outgoing Response: %O', resLog);
    } else if (resLog.statusCode >= 400) {
      debug.warn('Outgoing Response: %O', resLog);
    } else {
      debug.debug('Outgoing Response: %O', resLog);
    }
  };

  const abortFn = () => {
      cleanup();
      debug.warn('Request aborted by the client');
  };

  const errorFn = err => {
      cleanup();
      debug.error(`Request pipeline error: ${err}`);
  };

  res.on('close', abortFn); // aborted pipeline
  res.on('error', errorFn); // pipeline internal error

  next();
}

const logger = new Log('app:src');

export default logger;
