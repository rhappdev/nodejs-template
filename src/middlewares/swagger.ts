import * as express from "express";
import swaggerTools = require("swagger-tools");
import { Swagger20Request } from "swagger-tools";
import { readFileSync } from "fs";
import * as YAML from "js-yaml";
declare module "express" {
    interface Request {
        swagger: Swagger20Request["swagger"];
        requestId: string;
    }
}
const isProd = (process.env.NODE_ENV === "production");
function loadDocumentSync(file: string): any {
    return YAML.load(readFileSync(file));
}
export const initSwaggerMiddlware = function (app: express.Express, basePath: string, cb: any) {
    const swaggerDoc = loadDocumentSync(basePath + "/definition/swagger.yaml");
    const options = {
        controllers: basePath + "/routes",
        ignoreMissingHandlers: true,
        useStubs: false,
        validateResponse: true
    };
    swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
        // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
        app.use(middleware.swaggerMetadata());

        // Validate Swagger requests
        app.use(middleware.swaggerValidator({

        }));

        // Route validated requests to appropriate controller
        app.use(middleware.swaggerRouter(options));
        if (!isProd) {
            // Serve the Swagger documents and Swagger UI
            app.use(middleware.swaggerUi());
        }
        cb();

    });
};
