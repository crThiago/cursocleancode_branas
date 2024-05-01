// Entity

import {validate} from "./validateCpf";

export default class Account {
    private constructor(
        readonly accountId: string,
        readonly name: string,
        readonly email: string,
        readonly cpf: string,
        readonly isPassenger: boolean,
        readonly isDriver: boolean,
        readonly carPlate: string
    ) {
        if (!this.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error('Invalid name');
        if (!this.email.match(/^(.+)@(.+)$/)) throw new Error('Invalid email');
        if (!validate(this.cpf)) throw new Error('Invalid cpf');
        if (this.isDriver && this.carPlate && !this.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error('Invalid car plate');
    }

    // static factory method
    static create(
        name: string,
        email: string,
        cpf: string,
        isPassenger: boolean,
        isDriver: boolean,
        carPlate: string
    ) {
        const accountId = crypto.randomUUID();
        return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate);
    }

    // static factory method
    static restore(
        accountId: string,
        name: string,
        email: string,
        cpf: string,
        isPassenger: boolean,
        isDriver: boolean,
        carPlate: string
    ) {
        return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate);
    }
}
