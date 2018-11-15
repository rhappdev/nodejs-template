# Nodejs FES Template
This version includes support for OpenAPI 3.0

# Environment vars
This project uses the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|CORS           | Cors accepted values            | "*"      |


# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version 8.0.0


# Getting started
- Clone the repository
```
git clone  <git lab template url> <project_name>
```
- Install dependencies
```
cd <project_name>
npm install
```
- Build and run the project
```
npm start
```
  Navigate to `http://localhost:8001`

- API Document endpoints

  swagger Spec Endpoint : http://localhost:8001/api-docs 

  swagger-ui  Endpoint : http://localhost:8001/docs 


# TypeScript + Node 
The main purpose of this repository is to show a project setup and workflow for writing microservice. The Rest APIs will be using the Swagger (OpenAPI) Specification.




## Getting TypeScript
Add Typescript to project `npm`.
```
npm install -D typescript
```

## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **dist**                 | Contains the distributable (or output) from your TypeScript build.  |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **src**                  | Contains  source code that will be compiled to the dist dir                               |
| **src/config**           | Application configuration including environment-specific configs 
| **src/controllers**      | Controllers define functions to serve various express routes. 
| **src/lib**              | Common libraries to be used across your app.  
| **src/middlewares**      | Express middlewares which process the incoming requests before handling them down to the routes
| **src/routes**           | Contain all express routes, separated by module/area of application                       
| **src/models**           | Models define schemas that will be used in storing and retrieving data from Application database  |
| **src/monitoring**      | Prometheus metrics |
| **src**/index.ts         | Entry point to express app                                                               |
| package.json             | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)   | tsconfig.json            | Config settings for compiling source code only written in TypeScript    
| tslint.json              | Config settings for TSLint code style checking                                                |

## Building the project
### Configuring TypeScript compilation
```json
{
    "compilerOptions": {
      "target": "es5",
      "module": "commonjs",
      "outDir": "dist",
      "sourceMap": true
    },
    
    "include": [
      "src/**/*.ts"
      

    ],
    "exclude": [
      "src/**/*.spec.ts",
      "test",
      "node_modules"
    
    ]
  }

```

### Running the build
All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Runs full build and runs node on dist/index.js. Can be invoked with `npm start`                  |
| `build:copy`                   | copy the *.yaml file to dist/ folder      |
| `build:live`                   | Full build. Runs ALL build tasks       |
| `build:dev`                   | Full build. Runs ALL build tasks with all watch tasks        |
| `dev`                   | Runs full build before starting all watch tasks. Can be invoked with `npm dev`                                         |
| `test`                    | Runs build and run tests using mocha        |
| `lint`                    | Runs TSLint on project files       |

### Using the debugger in VS Code
Node.js debugging in VS Code is easy to setup and even easier to use. 
Press `F5` in VS Code, it looks for a top level `.vscode` folder with a `launch.json` file.

```json
{
        "version": "0.2.0",
        "configurations": [
            {
                "type": "node",
                "request": "launch",
                "name": "Launch Program",
                "program": "${workspaceFolder}/dist/index.js",
                "preLaunchTask": "tsc: build - tsconfig.json",
               
                "outFiles": [
                    "${workspaceFolder}/dist/*js"
                ]
            },
           
            {
                // Name of configuration; appears in the launch configuration drop down menu.
                "name": "Run mocha",
                "request":"launch",
                // Type of configuration. Possible values: "node", "mono".
                "type": "node",
                // Workspace relative or absolute path to the program.
                "program": "${workspaceRoot}/node_modules/mocha/bin/_mocha",
                
                // Automatically stop program after launch.
                "stopOnEntry": false,
                // Command line arguments passed to the program.
                "args": ["--no-timeouts", "--compilers", "ts:ts-node/register", "${workspaceRoot}/test/*"],
                
                // Workspace relative or absolute path to the working directory of the program being debugged. Default is the current workspace.
               
                // Workspace relative or absolute path to the runtime executable to be used. Default is the runtime executable on the PATH.
                "runtimeExecutable": null,
                // Environment variables passed to the program.
                "env": { "NODE_ENV": "test"}
            }
        ]
    }
```

## Testing
The tests are  written in Mocha and the assertions done using Chai

```
"mocha": "3.4.2",
"chai": "4.1.2",
"chai-http": "3.0.0",

```

### Example application.spec.ts
```
import chaiHttp = require("chai-http")
import * as chai from "chai"
import app from './application'

const expect = chai.expect;
chai.use(chaiHttp);


describe('App', () => {
  it('works', (done:Function): void => {
  chai.request(app)
      .get('/api/hello?greeting=world')
      .send({})
      .end((err:Error, res: any): void => {
          
          expect(res.statusCode).to.be.equal(200);
          expect(res.body.msg).to.be.equal("hello world");
          done();
      });
  
    });
});
```
### Running tests using NPM Scripts
````
npm run test

````
Test files are created under test folder.


# Swagger
## Specification
The swagger specification file is named as swagger.yaml. The file is located under definition folder.
Example:
```
paths:
  /hello:
    get:
      x-swagger-router-controller: helloWorldRoute
      operationId: helloWorldGet
      tags:
        - /hello
      description: >-
        Returns the current weather for the requested location using the
        requested unit.
      parameters:
        - name: greeting
          in: query
          description: Name of greeting
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Successful request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Hello'
        default:
          description: Invalid request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
servers:
  - url: '/api'
components:
  schemas:
    Hello:
      properties:
        msg:
          type: string
      required:
        - msg
    Error:
      properties:
        message:
          type: string
      required:
        - message
```
### Highlights of the swagger.yaml File

- /hello:
  
  Specifies how users should be routed when they make a request to this endpoint.
- x-swagger-router-controller: helloWorldRoute

  Specifies  which code file acts as the controller for this endpoint.
- get:

  Specifies the method being requested (GET, PUT, POST, etc.).
- operationId: hello
  
  Specifies the direct method to invoke for this endpoint within the controller/router 
- parameters:
  
   This section defines the parameters of your endpoint. They can be defined as path, query, header, formData, or body.
- definitions:
   
   This section defines the structure of objects used in responses or as parameters.
- servers:
   Defines the base path or the servers available.

## Swagger Middleware
The project is using npm module `oas-tools` that provides middleware functions for metadata, security, validation and routing, and bundles Swagger UI into Express using OpenAPI 3.0 spec.

__It is also possible to set configuration variables, these are them:__

| Name	| Type	| Explanation / Values |
| ------------- | ------------- | ------------- |
|`logLevel` | `String` | Possible values from less to more level of verbosity are: error, warning, custom, info and debug. Ignored if `customLogger` is used. Default is info. |
|`logFile` | `String` | Logs file path. Ignored if `customLogger` is used. |
|`customLogger` | `Object` | Replaces the included logger with the one specified here, so that you can reuse your own logger. `logLevel` and `logFile` will be ignored if this variable is used. Null by default. |
|`controllers` | `String` | Controllers location path. |
|`strict`	| `Boolean` | Indicates whether validation must stop the request process if errors were found when validating according to specification file. false by default. |
|`router`	| `Boolean` | Indicates whether router middleware should be used. True by default. |
|`validator` | `Boolean` | Indicates whether validator middleware should be used. True by default. |
|`docs` | `Boolean` | Indicates whether API docs (Swagger UI) should be available. True by default. The swagger-ui endpoint is acessible at /docs endpoint.|
|`oasSecurity` | `Boolean` | Indicates whether security components defined in the spec file will be handled based on `securityFile` settings. `securityFile` will be ignored if this is set to false. Refer to [oasSecurity](#2-oassecurity) for more information. False by default. |
|`securityFile` | `Object`| Defines the settings that will be used to handle security. Ignored if `oasSecurity` is set to false. Null by default. |
|`oasAuth` | `Boolean` | Indicates whether authorization will be automatically handled based on `grantsFile` settings. `grantsFile` will be ignored if this is set to false. Refer to [oasAuth](#3-oasauth) for more information. False by default. |
|`grantsFile` | `Object` | Defines the settings that will be use to handle automatic authorization. Ignored if `oasAuth` is set to false. Null by default. |
|`ignoreUnknownFormats` | `Boolean`	| Indicates whether z-schema validator must ignore unknown formats when validating requests and responses. True by default. |

For setting these variables you can use the function configure and pass to it either a JavaScript object or a yaml/json file containing such object.

```javascript
const options = {
        controllers: basePath + "/routes",
        loglevel: "debug",
        strict: true,
        router: true,
        validator: true,
        docs: !isProd
    };
    swaggerTools.configure(options);
```
To initialise just type the following:
```javascript
const swaggerDoc = loadDocumentSync(basePath + "/definition/swagger.yaml");
    
    swaggerTools.initialize(swaggerDoc, app, function() {
        cb();
    });
```


- Swagger Router

  The Swagger Router connects the Express route handlers found in the controller files on the path specified, with the paths defined in the Swagger specification (swagger.yaml). The routing looks up the correct controller file and exported function based on parameters added to the Swagger spec for each path.

  Here is an example for a hello world endpoint:

  ```
  paths:
  /hello:
    get:
      x-swagger-router-controller: helloWorldRoute
      operationId: helloWorldGet
      tags:
        - /hello
      description: >-
        Returns the current weather for the requested location using the
        requested unit.
      parameters:
        - name: greeting
          in: query
          description: Name of greeting
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Successful request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Hello'
        default:
          description: Invalid request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  ```
The fields `x-swagger-router-controller` will point the middleware to a `helloWorldRoute.ts` file in the route's directory, while the `operationId` names the handler function to be invoked.

# TSLint
TSLint is a code linter that helps catch minor code quality and style issues.

## TSLint rules
All rules are configured through `tslint.json`.


## Running TSLint
To run TSLint you can call the main build script or just the TSLint task.
```
npm run build:live   // runs full build including TSLint
npm run lint  // runs only TSLint
```





