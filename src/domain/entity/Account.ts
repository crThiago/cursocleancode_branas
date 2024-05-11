// Entity

import Name from "../vo/Name";
import Email from "../vo/Email";
import Cpf from "../vo/Cpf";
import CarPlate from "../vo/CarPlate";

export default class Account {
    private constructor(
        readonly accountId: string,
        private name: Name,
        private email: Email,
        private cpf: Cpf,
        readonly isPassenger: boolean,
        readonly isDriver: boolean,
        private carPlate: CarPlate
    ) {}

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
        return new Account(accountId, new Name(name), new Email(email), new Cpf(cpf), isPassenger, isDriver, new CarPlate(carPlate));
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
        return new Account(accountId, new Name(name), new Email(email), new Cpf(cpf), isPassenger, isDriver, new CarPlate(carPlate));
    }

    setName(name: string) {
        this.name = new Name(name);
    }


    getName() {
        return this.name.getValue();
    }

    getEmail() {
        return this.email.getValue();
    }

    getCpf() {
        return this.cpf.getValue();
    }

    getCarPlate() {
        return this.carPlate.getValue();
    }
}
