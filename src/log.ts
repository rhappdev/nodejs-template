import * as winston from "winston";
import * as Debug from "debug";
import * as env from "./env";
import { getRequestId } from "./lib/cls";
import { IncomingHttpHeaders, OutgoingHttpHeaders } from "http";
import * as express from "express";
import * as P from "bluebird";
import * as perfy from "perfy";

export class TDebug {

  private debugger: debug.IDebugger;

  constructor(namespace: string) {
      this.debugger = Debug(namespace);
  }

  public log(formatter: string, ...args: any[]) {
    this.logger(Levels.Log, formatter, ...args);
  }

  public error(formatter: string, ...args: any[]) {
    this.logger(Levels.Error, formatter, ...args);
  }

  public warn(formatter: string, ...args: any[]) {
    this.logger(Levels.Warn, formatter, ...args);
  }

  public verbose(formatter: string, ...args: any[]) {
    this.logger(Levels.Verbose, formatter, ...args);
  }

  public silly(formatter: string, ...args: any[]) {
    this.logger(Levels.Silly, formatter, ...args);
  }

  public start(label: string) {
    perfy.start(getRequestId() + "." + label);
  }

  public end(label: string) {
    const selector = getRequestId() + "." + label;
    if (perfy.exists(selector)) {
      const result = perfy.end(getRequestId() + "." + label);
      this.logger(Levels.Log, `${label} executed in ${result.time} sec.`);
    }
  }

  private logger(level: Levels, formatter: string, ...args: any[]) {
    const message = getRequestId() ? getRequestId() + " " + level + " " + formatter  : formatter;
    this.debugger(message, ...args);
  }
}

const debug = new TDebug("app:src:lib:log");

export enum Levels {
  Log = "LOG",
  Error = "ERROR",
  Warn = "WARN",
  Verbose = "VERBOSE",
  Info = "INFO",
  Debug = "DEBUG",
  Silly = "SILLY"
}

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

export async function inOutLogger(req: express.Request, res: express.Response, next: express.NextFunction): P <any> {
  const reqLog = {
    method : req.method,
    originalUrl: req.originalUrl,
    requestId: req.requestId,
    headers: req.headers,
    params: req.query
  } as RequestLog;
  debug.log("Incoming Request: %O", reqLog);

  const oldWrite = res.write;
  const oldEnd = res.end;

  const chunks = [];

  res.write = (...restArgs): boolean => {
    if (restArgs[0] && chunks.length === 0) {
      chunks.push(new Buffer(restArgs[0]));
    }
    oldWrite.apply(res, restArgs);
    return true;
  };

  res.end = (...restArgs) => {
    if (restArgs[0]) {
      chunks.push(new Buffer(restArgs[0]));
    }
    oldEnd.apply(res, restArgs);
    logFn();
  };

  const cleanup = () => {
    res.removeListener("close", abortFn);
    res.removeListener("error", errorFn);
  };

  const logFn = () => {
    cleanup();
    const body = Buffer.concat(chunks).toString("utf8");
    const resLog = {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      contentLength: res.get("Content-Length") || 0,
      contentType: res.get("Content-Type"),
      body,
      headers: res.getHeaders ? res.getHeaders() : undefined // Added in 7.7.0
    } as ResponseLog;
    if (resLog.statusCode >= 500) {
      debug.error("Outgoing Response: %O", resLog);
    } else if (resLog.statusCode >= 400) {
      debug.warn("Outgoing Response: %O", resLog);
    } else {
      debug.log("Outgoing Response: %O", resLog);
    }
  };

  const abortFn = () => {
      cleanup();
      debug.warn("Request aborted by the client");
  };

  const errorFn = err => {
      cleanup();
      debug.error(`Request pipeline error: ${err}`);
  };

  res.on("close", abortFn); // aborted pipeline
  res.on("error", errorFn); // pipeline internal error

  next();
}

/* const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: true,
      "level": env.get("LOG_LEVEL")
    })
  ]
}); */

const logger = winston.createLogger({
  level: env.get("LOG_LEVEL"),
  transports: [ new winston.transports.Console()]
});

export default logger;
