// main

import {PgPromiseAdapter} from "./infra/database/DatabaseConnection";
import {ExpressAdapter, HapiAdapter} from "./infra/http/HttpServer";


const connection = new PgPromiseAdapter();
// const httpServer = new ExpressAdapter();
const httpServer = new HapiAdapter();
httpServer.listen(3000);
