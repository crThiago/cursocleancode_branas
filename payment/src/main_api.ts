import ProcessPayment from "./application/usecase/ProcessPayment";
import { ExpressAdapter } from "./infra/http/HttpServer";
import PaymentController from "./infra/http/PaymentController";
import QueueController from "./infra/queue/QueueController";
import {RabbitMQAdapter} from "./infra/queue/Queue";
import {PgPromiseAdapter} from "./infra/database/DatabaseConnection";
import ORM from "./infra/orm/ORM";
import TransactionRepositoryORM from "./infra/repository/TransactionRepositoryORM";
import PJBankGateway from "./infra/gateway/PJBankGateway";

async function main () {
    const httpServer = new ExpressAdapter();
    const connection = new PgPromiseAdapter();
    const orm = new ORM(connection);
    const transactionRepository = new TransactionRepositoryORM(orm);
    const processPayment = new ProcessPayment(transactionRepository, new PJBankGateway());
    new PaymentController(httpServer, processPayment);
    const queue = new RabbitMQAdapter();
    await queue.connect();
    new QueueController(queue, processPayment);
    httpServer.listen(3001);
}
main();
