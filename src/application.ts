
// import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { resolve } from 'path';
import { initSwaggerMiddlware } from './middlewares/swagger';
import * as env from './env';
import { inOutLogger } from './log';
import * as monit from './monitoring';
import * as cls from './lib/cls';
import { getCorsOptions } from './cors';

env.checkEnv();
const app = express();
export default app;
monit.init(app);
app.use(cors(getCorsOptions()));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cls.setRequestId);
app.use(inOutLogger);

initSwaggerMiddlware(app, resolve(__dirname), () => {
  app.use(function (err, req: express.Request, res: express.Response, next) {
    if (err) {
      const errStr = err.message || err.toString();
      const errMsg = { message: errStr, extra: err };
      if (res.statusCode < 400) {
        res.status(500);
      }
      res.json(errMsg);
    }
  });

});
