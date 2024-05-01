import {AccountRepositoryDatabase, AccountRepositoryMemory} from "../src/infra/repository/AccountRepository";
import {MailerGatewayMemory} from "../src/infra/gateway/MailerGateway";
import {Signup} from "../src/application/usecase/Signup";
import RequestRide from "../src/application/usecase/RequestRide";
import RideRepositoryDatabase from "../src/infra/repository/RideRepository";
import GetRide from "../src/application/usecase/GetRide";
import {PgPromiseAdapter} from "../src/infra/database/DatabaseConnection";
import Account from "../src/domain/Account";

let connection: PgPromiseAdapter;
let accountRepository: AccountRepositoryDatabase;
let rideRepository: RideRepositoryDatabase;

beforeEach(async () => {
    connection = new PgPromiseAdapter();
    accountRepository = new AccountRepositoryDatabase(connection);
    rideRepository = new RideRepositoryDatabase(connection);
});

afterEach(async () => {
    await connection.close();
})

test("Deve solicitar uma corrida", async function () {
    const mailGateway = new MailerGatewayMemory();
    const signup = new Signup(accountRepository, mailGateway);
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "87748248800",
        isPassenger: true
    };
    const outputSignup = await signup.execute(inputSignup);
    const requestRide = new RequestRide(accountRepository, rideRepository);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    const outputRideRequest = await requestRide.execute(inputRequestRide);
    expect(outputRideRequest.rideId).toBeDefined();
    const getRide = new GetRide(accountRepository, rideRepository);
    const inputGetRide = {
        rideId: outputRideRequest.rideId
    }
    const outputGetRide = await getRide.execute(inputGetRide);
    expect(outputGetRide.rideId).toBe(inputGetRide.rideId);
    expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
    expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
    expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
    expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
    expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
    expect(outputGetRide.status).toBe('requested');
    expect(outputGetRide.passengerName).toBe('John Doe');
    expect(outputGetRide.passengerEmail).toBe(inputSignup.email);
});

test("Não deve poder solicitar uma corrida se não for um passageiro", async function () {
    const mailGateway = new MailerGatewayMemory();
    const signup = new Signup(accountRepository, mailGateway);
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "87748248800",
        isDriver: true
    };
    const outputSignup = await signup.execute(inputSignup);
    const requestRide = new RequestRide(accountRepository, rideRepository);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow('Account is not from passenger');
});

test("Deve solicitar uma corrida", async function () {
    const mailGateway = new MailerGatewayMemory();
    const signup = new Signup(accountRepository, mailGateway);
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "87748248800",
        isPassenger: true
    };
    const outputSignup = await signup.execute(inputSignup);
    const requestRide = new RequestRide(accountRepository, rideRepository);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    await requestRide.execute(inputRequestRide);
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow('Passenger already has an active ride');
});
