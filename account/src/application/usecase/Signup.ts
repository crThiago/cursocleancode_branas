// use case

import {MailerGateway} from "../../infra/gateway/MailerGateway";
import Account from "../../domain/entity/Account";


export class Signup {

    constructor(readonly accountRepository: AccountRepositorySignup, readonly mailerGateway: MailerGateway) {
    }

    async execute (input: Input): Promise<any> {
        const existingAccount = await this.accountRepository.getAccountByEmail(input.email);
        if (existingAccount) throw new Error('Account already exists');
        const account = Account.create(
            input.name,
            input.email,
            input.cpf,
            !!input.isPassenger,
            !!input.isDriver,
            input.carPlate ?? ''
        )
        await this.accountRepository.saveAccount(account)
        await this.mailerGateway.send(account.getEmail(), 'Welcome', 'Welcome to CCCCAT16!');
        return {
            accountId: account.accountId
        };
    }
}

type Input = {
    name: string
    email: string
    cpf: string
    isPassenger?: boolean
    isDriver?: boolean
    carPlate?: string
}


// I do SOLID: segregrando interfaces e depedendo apenas do que é necessário
export interface AccountRepositorySignup {
    getAccountByEmail(email: string): Promise<Account | undefined>;
    saveAccount(account: Account): Promise<any>;
}
