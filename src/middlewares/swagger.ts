import * as express from "express";
import swaggerTools = require("oas-tools");
import { Swagger20Request } from "oas-tools";
import { readFileSync } from "fs";
import * as YAML from "js-yaml";
declare module "express" {
    interface Request {
        swagger: Swagger20Request["swagger"];
        requestId: string;
    }
}
// const isProd = (process.env.NODE_ENV === "production");
function loadDocumentSync(file: string): any {
    return YAML.load(readFileSync(file, "utf8"));
}
export const initSwaggerMiddlware = function (app: express.Express, basePath: string, cb: any) {
    const swaggerDoc = loadDocumentSync(basePath + "/definition/swagger.yaml");
    const options = {
        controllers: basePath + "/routes",
        loglevel: "debug",
        strict: true,
        router: true,
        validator: true,
        docs: {
            apiDocs: "/api-docs",
            apiDocsPrefix: "",
            swaggerUi: "/docs",
            swaggerUiPrefix: ""
        }
    };
    swaggerTools.configure(options);
    swaggerTools.initialize(swaggerDoc, app, function() {
        cb();
    });
};
