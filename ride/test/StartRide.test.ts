import RequestRide from "../src/application/usecase/RequestRide";
import RideRepositoryDatabase from "../src/infra/repository/RideRepository";
import GetRide from "../src/application/usecase/GetRide";
import {PgPromiseAdapter} from "../src/infra/database/DatabaseConnection";
import AcceptRide from "../src/application/usecase/AcceptRide";
import StartRide from "../src/application/usecase/StartRide";
import HttpClient, {AxiosAdapter} from "../src/infra/http/HttpClient";
import AccountGateway from "../src/application/gateway/AccountGateway";
import AccountGatewaryHttp from "../src/infra/gateway/AccountGatewaryHttp";

let connection: PgPromiseAdapter;
let rideRepository: RideRepositoryDatabase;
let axiosAdapter: HttpClient;
let accountGateway: AccountGateway;

beforeEach(async () => {
    connection = new PgPromiseAdapter();
    rideRepository = new RideRepositoryDatabase(connection);

    axiosAdapter = new AxiosAdapter();
    accountGateway = new AccountGatewaryHttp(axiosAdapter);
});

afterEach(async () => {
    await connection.close();
})

test("Deve aceitar uma corrida", async function () {

    const inputSignupPassenger = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "87748248800",
        isPassenger: true
    };
    const outputSignupPassenger = await accountGateway.signup(inputSignupPassenger);

    const inputSignupDriver = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "87748248800",
        carPlate: "AAA9999",
        isDriver: true
    };
    const outputSignupDriver = await accountGateway.signup(inputSignupDriver);

    const requestRide = new RequestRide(rideRepository, accountGateway);
    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);

    const acceptRide = new AcceptRide(rideRepository, accountGateway);
    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId
    };
    await acceptRide.execute(inputAcceptRide);

    const startRide = new StartRide(rideRepository);
    const inputStartRide = {
        rideId: outputRequestRide.rideId,
    };
    await startRide.execute(inputStartRide);

    const getRide = new GetRide(rideRepository, accountGateway);
    const inputGetRide = {
        rideId: outputRequestRide.rideId
    };
    const outputGetRide = await getRide.execute(inputGetRide);
    expect(outputGetRide.status).toBe("in_progress");
});
