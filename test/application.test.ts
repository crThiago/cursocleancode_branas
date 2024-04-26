import {AccountDAODatabase, AccountDAOMemory} from "../src/resource/AccountDAO";
import {Signup} from "../src/application/Signup";
import {GetAccount} from "../src/application/GetAccount";
import {MailerGatewayMemory} from "../src/resource/MailerGateway";


let signup: Signup;
let getAccount: GetAccount;

beforeEach(async () => {
	// const accountDAO = new AccountDAODatabase();
	const accountDAO = new AccountDAOMemory();
	const mailGateway = new MailerGatewayMemory();
	signup = new Signup(accountDAO, mailGateway);
	getAccount = new GetAccount(accountDAO);
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
