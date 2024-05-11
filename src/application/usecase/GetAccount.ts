// use case

import {AccountRepository} from "../../infra/repository/AccountRepository";

export class GetAccount {

    constructor(readonly accountRepository: AccountRepository) {
    }

    async execute (input: any): Promise<Output> {
        const account = await this.accountRepository.getAccountById(input.accountId);
        return {
            accountId: account.accountId,
            name: account.getName(),
            email: account.getEmail(),
            cpf: account.getCpf(),
            isPassenger: account.isPassenger,
            isDriver: account.isDriver,
            carPlate: account.getCarPlate(),
        };
    }
}

// DTO - data transfer object
type Output = {
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    isPassenger: boolean,
    isDriver: boolean,
    carPlate: string
}
