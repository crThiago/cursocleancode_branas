import ORM from "../src/infra/orm/ORM";
import {PgPromiseAdapter} from "../src/infra/database/DatabaseConnection";
import TransactionModel from "../src/infra/orm/TransactionModel";

test("Deve testar ORM", async function () {
    const connection = new PgPromiseAdapter();
    const orm = new ORM(connection);
    const transactionId = crypto.randomUUID();
    const transacitonModel = new TransactionModel(transactionId, crypto.randomUUID(), 10, 'a',  new Date());
    await orm.save(transacitonModel);
    const transaction = await orm.get('transaction_id', transactionId, TransactionModel);
    console.log(transaction)
    await connection.close();
});
