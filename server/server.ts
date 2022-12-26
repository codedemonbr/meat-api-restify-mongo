import * as fs from "fs";

import * as mongoose from "mongoose";
import * as restify from "restify";

import { environment } from "../common/environment";
import { logger } from "../common/logger";
import { Router } from "../common/router";
import { handleError } from "./error.handler";
import { mergePatchBodyParser } from "./merge-patch.parser";

import { tokenParser } from "../security/token.parser";

export class Server {
  application: restify.Server;

  initializeDb(): mongoose.MongooseThenable {
    (<any>mongoose).Promise = global.Promise;
    return mongoose.connect(environment.db.url, {
      useMongoClient: true,
    });
  }

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const options: restify.ServerOptions = {
          name: "meat-api",
          version: "1.0.0",
          log: logger,
        };

        if (environment.security.enableHTTPS) {
          (options.certificate = fs.readFileSync(
            environment.security.certificate
          )),
            (options.key = fs.readFileSync(environment.security.key));
        }

        this.application = restify.createServer(options);

        this.application.pre(
          restify.plugins.requestLogger({
            log: logger,
          })
        );

        // plugins ativos para lidar com json e realizar query
        this.application.use(restify.plugins.queryParser());
        this.application.use(restify.plugins.bodyParser());
        this.application.use(mergePatchBodyParser);
        this.application.use(tokenParser);

        //Routes here
        for (let router of routers) {
          router.applyRoutes(this.application);
        }

        this.application.listen(environment.server.port, () => {
          resolve(this.application);
        });

        this.application.on("restifyError", handleError);
        /**
         * Evitar usar audit log ele expoe tudo da request
         * isso pode ser considerado uma falha de segurança.
         * Implementar o proprio log é melhor adequado.
         */
        // this.application.on(
        //   "after",
        //   restify.plugins.auditLogger({
        //     log: logger,
        //     event: "after",
        //   })
        // );

        // this.application.on("audit", (data) => {});
      } catch (error) {
        reject(error);
      }
    });
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initializeDb().then(() =>
      this.initRoutes(routers).then(() => this)
    );
  }

  shutdown() {
    return mongoose.disconnect().then(() => this.application.close());
  }
}
