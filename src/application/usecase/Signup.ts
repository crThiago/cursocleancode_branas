// use case

import {AccountRepository} from "../../infra/repository/AccountRepository";
import {MailerGateway} from "../../infra/gateway/MailerGateway";
import Account from "../../domain/Account";


export class Signup {

    constructor(readonly accountRepository: AccountRepository, readonly mailerGateway: MailerGateway) {
    }

    async execute (input: any): Promise<any> {
        const existingAccount = await this.accountRepository.getAccountByEmail(input.email);
        if (existingAccount) throw new Error('Account already exists');
        const account = Account.create(
            input.name,
            input.email,
            input.cpf,
            input.isPassenger,
            input.isDriver,
            input.carPlate
        )
        await this.accountRepository.saveAccount(account)
        await this.mailerGateway.send(account.email, 'Welcome', 'Welcome to CCCCAT16!');
        return {
            accountId: account.accountId
        };
    }
}
