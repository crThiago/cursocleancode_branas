// main

import {Signup} from "./application/usecase/Signup";
import {GetAccount} from "./application/usecase/GetAccount";
import {AccountRepositoryDatabase} from "./infra/repository/AccountRepository";
import {MailerGatewayMemory} from "./infra/gateway/MailerGateway";
import {PgPromiseAdapter} from "./infra/database/DatabaseConnection";
import AccountController from "./infra/http/AccountController";
import {ExpressAdapter, HapiAdapter} from "./infra/http/HttpServer";


const connection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(connection);
const mailGateway = new MailerGatewayMemory();
const signup = new Signup(accountRepository, mailGateway);
const getAccount = new GetAccount(accountRepository);
// const httpServer = new ExpressAdapter();
const httpServer = new HapiAdapter();
new AccountController(httpServer, signup, getAccount);
httpServer.listen(3002);
