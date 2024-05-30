import {AccountRepositoryDatabase, AccountRepositoryMemory} from "../src/infra/repository/AccountRepository";
import {Signup} from "../src/application/usecase/Signup";
import {GetAccount} from "../src/application/usecase/GetAccount";
import {MailerGatewayMemory} from "../src/infra/gateway/MailerGateway";
import sinon from "sinon";
import Account from "../src/domain/entity/Account";
import {PgPromiseAdapter} from "../src/infra/database/DatabaseConnection";


let signup: Signup;
let getAccount: GetAccount;

beforeEach(async () => {
	// const accountRepository = new accountRepositoryDatabase();
	// Fake é uma implementação falsa, que mimifica a implementação original
	const accountRepository = new AccountRepositoryMemory();
	const mailGateway = new MailerGatewayMemory();
	signup = new Signup(accountRepository, mailGateway);
	getAccount = new GetAccount(accountRepository);
})

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};

	const outputSinup = await signup.execute(input);
	expect(outputSinup.accountId).toBeDefined();

	const outputGetAccount = await getAccount.execute(outputSinup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
});

test("Deve criar uma conta para o motorista", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		carPlate: "ABC1234",
		isPassenger: false,
		isDriver: true
	};

	const outputSinup = await signup.execute(input);
	expect(outputSinup.accountId).toBeDefined();

	const outputGetAccount = await getAccount.execute(outputSinup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	// expect(outputGetAccount.carPlate).toBe(input.carPlate);
});

test("Não deve criar uma conta para o motorista se o nome for inválido", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		carPlate: "ABC1234",
		isPassenger: false,
		isDriver: true
	};

	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar uma conta para o passageiro com email inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}`,
		cpf: "87748248800",
		isPassenger: true
	};

	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar uma conta para o passageiro com conta existente", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};

	await signup.execute(input)
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Account already exists"));
});

test("Não deve criar uma conta para o passageiro com cpf inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "877482488",
		isPassenger: true
	};

	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar uma conta para o motorista com placa inválida", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		carPlate: "ABC",
		isPassenger: false,
		isDriver: true
	};

	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid car plate"));
});

// stub faz uma sobreescrita do comportamento
test("Deve criar uma conta para o passageiro com stub", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const saveAccountStub = sinon.stub(AccountRepositoryDatabase.prototype, "saveAccount").resolves();
	const getAccountByEmailStub = sinon.stub(AccountRepositoryDatabase.prototype, "getAccountByEmail").resolves(undefined);
	const getAccountByIdStub = sinon.stub(AccountRepositoryDatabase.prototype, "getAccountById").resolves(
		Account.restore("", input.name, input.email, input.cpf, true, true, "")
	); // Stub para retornar o input como resposta

	const connection = new PgPromiseAdapter();
	const accountRepository = new AccountRepositoryDatabase(connection);
	const mailGateway = new MailerGatewayMemory();
	const signup = new Signup(accountRepository, mailGateway);
	const outputSinup = await signup.execute(input);
	expect(outputSinup.accountId).toBeDefined();

	const getAccount = new GetAccount(accountRepository);
	const outputGetAccount = await getAccount.execute(outputSinup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	saveAccountStub.restore();
	getAccountByEmailStub.restore();
	getAccountByIdStub.restore();
	await connection.close()
});

// Spy registra tudo que aconteceu com o componente que está sendo espionado, depois você faz a verificação que quiser
test("Deve criar uma conta para o passageiro com spy", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const sendSpy = sinon.spy(MailerGatewayMemory.prototype, "send");
	const connection = new PgPromiseAdapter;
	const accountRepository = new AccountRepositoryDatabase(connection);
	const mailGateway = new MailerGatewayMemory();
	const signup = new Signup(accountRepository, mailGateway);
	const outputSinup = await signup.execute(input);
	expect(outputSinup.accountId).toBeDefined();

	const getAccount = new GetAccount(accountRepository);
	const outputGetAccount = await getAccount.execute(outputSinup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(sendSpy.calledOnce).toBe(true);
	expect(sendSpy.calledWith(input.email, 'Welcome', 'Welcome to CCCCAT16!')).toBe(true);
	sendSpy.restore();
	connection.close()
});


// mock mistura características de Stub e Spy, criando as expectativas no próprio objeto (mock)
test("Deve criar uma conta para o passageiro com mock", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};

	const sendMock = sinon.mock(MailerGatewayMemory.prototype);
	sendMock.expects('send').once().withArgs(input.email, 'Welcome', 'Welcome to CCCCAT16!').callsFake(() => {
		console.log('Comportamento fake');
	});

	const connection = new PgPromiseAdapter;
	const accountRepository = new AccountRepositoryDatabase(connection);
	const mailGateway = new MailerGatewayMemory();
	const signup = new Signup(accountRepository, mailGateway);
	const outputSinup = await signup.execute(input);
	expect(outputSinup.accountId).toBeDefined();

	const getAccount = new GetAccount(accountRepository);
	const outputGetAccount = await getAccount.execute(outputSinup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	sendMock.verify();
	connection.close()
});
