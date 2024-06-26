// interface adapter

import Account from "../../domain/entity/Account";
import DatabaseConnection from "../database/DatabaseConnection";
import {AccountRepositorySignup} from "../../application/usecase/Signup";

// Driven/Resource PORT
export interface AccountRepository extends AccountRepositorySignup {
    getAccountByEmail(email: string): Promise<Account | undefined>;
    getAccountById(accountId: string): Promise<Account>;
    saveAccount(account: Account): Promise<any>;
}

// Driven/Resource ADAPTER
export class AccountRepositoryDatabase implements AccountRepository {
    constructor(readonly connection: DatabaseConnection) {
    }

    async getAccountByEmail (email: string): Promise<Account | undefined> {
        const [accountData] = await this.connection.query("select * from cccat16.account where email = $1", [email]);
        if (!accountData) return;
        return Account.restore(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.is_passenger, accountData.is_driver, accountData.car_plate);
    }

    async getAccountById (accountId: string): Promise<Account> {
        const [accountData] = await this.connection.query("select * from cccat16.account where account_id = $1", [accountId]);
        return Account.restore(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.is_passenger, accountData.is_driver, accountData.car_plate);
    }

    async saveAccount (account: Account) {
        await this.connection.query("insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
            [account.accountId, account.getName(), account.getEmail(), account.getCpf(), account.getCarPlate(), !!account.isPassenger, !!account.isDriver]);
    }
}

// Driven/Resource ADAPTER
export class AccountRepositoryMemory implements AccountRepository {
    accounts: Account[];

    constructor() {
        this.accounts = [];
    }

    async getAccountByEmail(email: string): Promise<Account | undefined> {
        const account = this.accounts.find((account: Account) => account.getEmail() === email);
        return account;
    }

    async getAccountById(accountId: string): Promise<any> {
        const account = this.accounts.find((account: Account) => account.accountId === accountId);
        return account;
    }

    async saveAccount(account: Account): Promise<void> {
        this.accounts.push(account);
    }

}
