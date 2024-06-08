import RequestRide from "../src/application/usecase/RequestRide";
import RideRepositoryDatabase from "../src/infra/repository/RideRepository";
import GetRide from "../src/application/usecase/GetRide";
import {PgPromiseAdapter, UnitOfWork} from "../src/infra/database/DatabaseConnection";
import AcceptRide from "../src/application/usecase/AcceptRide";
import StartRide from "../src/application/usecase/StartRide";
import PositionRepositoryDatabase from "../src/infra/repository/PositionRepository";
import UpdatePosition from "../src/application/usecase/UpdatePosition";
import FinishRide from "../src/application/usecase/FinishRide";
import PaymentGatewayHttp from "../src/infra/gateway/PaymentGatewayHttp";
import Registry from "../src/infra/di/Registry";
import HttpClient, {AxiosAdapter} from "../src/infra/http/HttpClient";
import AccountGateway from "../src/application/gateway/AccountGateway";
import AccountGatewaryHttp from "../src/infra/gateway/AccountGatewaryHttp";
import Mediator from "../src/infra/mediator/Mediator";
import ProcessPayment from "../src/application/usecase/ProcessPayment";
import {RabbitMQAdapter} from "../src/infra/queue/Queue";

let connection: PgPromiseAdapter;
let rideRepository: RideRepositoryDatabase;
let axiosAdapter: HttpClient;
let accountGateway: AccountGateway;

beforeEach(async () => {
    connection = new PgPromiseAdapter();
    rideRepository = new RideRepositoryDatabase(connection);
    axiosAdapter = new AxiosAdapter()
    accountGateway =  new AccountGatewaryHttp(axiosAdapter);
});

afterEach(async () => {
    await connection.close();
})

test("Deve finalizar uma corrida", async function () {
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

    const unitOfWork = new UnitOfWork();
    const positionRepositoryUoW = new PositionRepositoryDatabase(unitOfWork);
    const rideRepositoryUoW = new RideRepositoryDatabase(unitOfWork);
    const updatePosition = new UpdatePosition(rideRepositoryUoW, positionRepositoryUoW);
    const inputUpdatePosition1 = {
        rideId: outputRequestRide.rideId,
        lat: -27.584905257808835,
        long: -48.545022195325124,
        date: new Date("2023-03-01T21:30:00")
    };
    await updatePosition.execute(inputUpdatePosition1);
    const inputUpdatePosition2 = {
        rideId: outputRequestRide.rideId,
        lat: -27.496887588317275,
        long: -48.522234807851476,
        date: new Date("2023-03-01T22:30:00")
    };
    await updatePosition.execute(inputUpdatePosition2);
    const inputUpdatePosition3 = {
        rideId: outputRequestRide.rideId,
        lat: -27.584905257808835,
        long: -48.545022195325124,
        date: new Date("2023-03-01T23:30:00")
    };
    await updatePosition.execute(inputUpdatePosition3);

    const paymentGatewayHttp = new PaymentGatewayHttp();
    Registry.getInstance().provide('PaymentGateway', paymentGatewayHttp);
    Registry.getInstance().provide('RideRepository', rideRepository);
    const mediator = new Mediator();
    mediator.register('rideCompleted', async (data: any) => {
        const processPayment = new ProcessPayment();
        await processPayment.execute(data);
    })
    // Registry.getInstance().provide('Mediator', mediator);
    const queue = new RabbitMQAdapter();
    await queue.connect();
    Registry.getInstance().provide('Queue', queue);
    const finishRide = new FinishRide();
    const inputFinishRide = {
        rideId: outputRequestRide.rideId
    };
    await finishRide.execute(inputFinishRide);

    const getRide = new GetRide(rideRepository, accountGateway);
    const inputGetRide = {
        rideId: outputRequestRide.rideId
    };
    const outputGetRide = await getRide.execute(inputGetRide);
    expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
    expect(outputGetRide.fare).toBe(63);
    expect(outputGetRide.status).toBe('completed');
    await unitOfWork.close();
});
