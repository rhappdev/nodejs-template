import app from './application';
import log from './log';
const serverPort = process.env.OPENSHIFT_NODEJS_PORT || 8001;

app.listen(serverPort, () => {
  return log.info(`server is listening on ${serverPort}`);
});
