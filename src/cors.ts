import * as env from "./env";

export function getCorsOptions(): object {
  if (env.get("CORS") !== "*") {
    let whiteList: string [];
    whiteList = env.get("CORS").split(",");
    console.log("CORS whitelist:", whiteList);
    return { origin: whiteList };
  } else {
    console.log("CORS whitelist: *");
    return { origin: env.get("CORS") };
  }
}
