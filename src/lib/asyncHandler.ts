import * as express from "express";
import * as P from "bluebird";
import log from "../log";
import { TDebug } from "../log";
const debug = new TDebug("src:lib:asyncHandler");
export interface HandlerOption {
  cache?: boolean;
  cacheLive?: number;
}
export function asyncHandler(
  handler: (req: express.Request, res: express.Response, next) => P<any>,
  name: string, options?: HandlerOption): express.Handler {
  debug.log("Register handler with option: %o", options);
  return (req: express.Request, res: express.Response, next) => {
    async function exec(): P<any> {
      debug.start("SERVICE:" + name);
      if (options && options.cache) {
        try {
          const item = await getCache(req);
          if (item) {
            return item.data;
          }
        } catch (e) {
          log.error(e);
          console.error(e.stack);
        }

      }
      const data = await handler(req, res, next);
      if (data && options && options.cache) {
        cache(req, {
          data,
          expTs: Date.now() + options.cacheLive ? options.cacheLive : 3600000
        });
      }
      return data;
    }
    exec()
      .then((data) => {
        debug.end("SERVICE:" + name);
        if (data) {
          res.json(data);
        } else if (!res.finished) {
          debug.log("no more response to send, status code: %d", res.statusCode);
          res.end();
        }
      }, (error) => {
        debug.end("SERVICE:" + name);
        next(error);
      });
  };
}
interface CachedItem {
  data: object;
  expTs: number;
}
const cachedData: { [key: string]: CachedItem } = {};
// TODO use cache server
async function cache(req: express.Request, item: CachedItem): P<any> {
  const fullUrl = getUrl(req);
  debug.log("Set cache: %s data: %o", fullUrl, item);
  cachedData[fullUrl] = item;
}
// async function hasCache(req: express.Request): P<boolean> {
//   const fullUrl = getUrl(req);
//   return typeof cachedData[fullUrl] !== "undefined";
// }
async function getCache(req: express.Request): P<CachedItem> {
  const fullUrl = getUrl(req);
  debug.log("Get cache: %s", fullUrl);
  const data = cachedData[fullUrl];
  if (data && data.expTs < Date.now()) {
    debug.log("Cache expired: %s", fullUrl);
    delete cachedData[fullUrl];
    return;
  } else {
    debug.log("Hit cache: %s", fullUrl);
    return data;
  }
}

function getUrl(req: express.Request) {
  return req.protocol + "://" + req.get("host") + req.originalUrl;
}
