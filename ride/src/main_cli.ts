// main, framework & driver, Interface adapter

import {AccountRepositoryDatabase} from "./infra/repository/AccountRepository";
import {MailerGatewayMemory} from "./infra/gateway/MailerGateway";
import {Signup} from "./application/usecase/Signup";
import {PgPromiseAdapter} from "./infra/database/DatabaseConnection";

let input: any = {};
let step = '';

process.stdin.on("data", async function (chunk) {
    const command = chunk.toString().replace(/\n/g, "");
    if (command.startsWith('name')) {
        input.name = command.replace("name ", "");
    }
    if (command.startsWith('email')) {
        input.email = command.replace("email ", "");
    }
    if (command.startsWith('cpf')) {
        input.cpf = command.replace("cpf ", "");
    }

    if (command.startsWith('signup')) {
        const connection = new PgPromiseAdapter();
        const accountRepository = new AccountRepositoryDatabase(connection);
        const mailerGateway = new MailerGatewayMemory();
        const signup = new Signup(accountRepository, mailerGateway);
        const output = await signup.execute(input);
        console.log(output);
        connection.close();
    }
})
