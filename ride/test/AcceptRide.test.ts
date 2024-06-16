import RequestRide from "../src/application/usecase/RequestRide";
import RideRepositoryDatabase from "../src/infra/repository/RideRepository";
import GetRide from "../src/application/usecase/GetRide";
import {PgPromiseAdapter} from "../src/infra/database/DatabaseConnection";
import AcceptRide from "../src/application/usecase/AcceptRide";
import AccountGateway from "../src/application/gateway/AccountGateway";
import HttpClient, {FetchAdapter} from "../src/infra/http/HttpClient";
import AccountGatewaryHttp from "../src/infra/gateway/AccountGatewaryHttp";
import GetRideQuery from "../src/application/query/GetRideQuery";

let connection: PgPromiseAdapter;
let rideRepository: RideRepositoryDatabase;
let fetchAdapter: HttpClient;
let accountGateway: AccountGateway;

beforeEach(async () => {
    connection = new PgPromiseAdapter();
    fetchAdapter = new FetchAdapter();
    accountGateway = new AccountGatewaryHttp(fetchAdapter);
    rideRepository = new RideRepositoryDatabase(connection);
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

    // const getRide = new GetRide(rideRepository, accountGateway);
    const getRide = new GetRideQuery(connection)
    const inputGetRide = {
        rideId: outputRequestRide.rideId
    };
    const outputGetRide = await getRide.execute(inputGetRide.rideId);
    expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe("accepted");
    expect(outputGetRide.driverName).toBe("John Doe");
});
