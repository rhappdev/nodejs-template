import { Request, Response } from 'express';
import promClient = require('prom-client');
import '../middlewares/swagger';
const responseTime = new promClient.Gauge({
  name: 'last_response_time',
  help: 'The time elapse of last http requests',
  labelNames: ['method', 'path']
});
const requestCount = new promClient.Counter({
  name: 'request_count',
  help: 'The request count since application starts',
  labelNames: ['method', 'path']
});
const responseStatCount = new promClient.Counter({
  name: 'response_status',
  help: 'The response status code since application starts',
  labelNames: ['method', 'path', 'statusCode']
});
export function requestWatch(req: Request, res: Response, next) {
  const labels: any = {
    method: req.method,
    path: req.path
  };
  const timer = responseTime.startTimer();
  requestCount.inc(labels);
  res.on('finish', () => {
    if (req.path) {
      labels.path = req.path;
    }
    responseStatCount.inc({
      method: labels.method,
      path: labels.path,
      statusCode: res.statusCode
    });
    timer(labels);
  });
  next();
}
export function reset() {
  responseTime.reset();
}
