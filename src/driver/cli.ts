import {AccountDAODatabase} from "../resource/AccountDAO";
import {MailerGatewayMemory} from "../resource/MailerGateway";
import {Signup} from "../application/Signup";

let input: any = {};
let step = '';

process.stdin.on("data", async function (chunk) {
    const command = chunk.toString().replace(/\n/g, "");
    if (command.startsWith('signup-passenger')) {
        process.stdout.write('passenger-name: ');
        step = 'name';
        return;
    }
    if (step === 'name') {
        input[step] = command.replace(/\r/g, '');
        console.log(input);
        process.stdout.write('passenger-email: ');
        step = 'email';
        return;
    }
    if (step === 'email') {
        input[step] = command.replace(/\r/g, '');
        console.log(input);
        process.stdout.write('passenger-cpf: ');
        step = 'cpf';
        return;
    }
    if (step === 'cpf') {
        input[step] = command.replace(/\r/g, '');
        console.log(input);
        const accountDAO = new AccountDAODatabase();
        const mailerGateway = new MailerGatewayMemory();
        const signup = new Signup(accountDAO, mailerGateway);
        const output = await signup.execute(input);
        console.log(output);
    }
})
