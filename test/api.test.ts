import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
}

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};

	const responseSinup = await axios.post("http://localhost:3000/signup", input);
	expect(responseSinup.status).toBe(200);
	const outputSinup = responseSinup.data;
	expect(outputSinup.accountId).toBeDefined();

	const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSinup.accountId}`);
	const outputGetAccount = responseGetAccount.data;
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
});

test("Deve criar uma conta para o driver", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		carPlate: "ABC1234",
		isPassenger: false,
		isDriver: true,
	};

	const responseSinup = await axios.post("http://localhost:3000/signup", input);
	expect(responseSinup.status).toBe(200);
	const outputSinup = responseSinup.data;
	expect(outputSinup.accountId).toBeDefined();

	const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSinup.accountId}`);
	const outputGetAccount = responseGetAccount.data;
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.car_plate).toBe(input.carPlate);
});

test("Não deve criar uma conta para o passageiro com nome inválido", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};

	const responseSinup = await axios.post("http://localhost:3000/signup", input);
	expect(responseSinup.status).toBe(422);
	const outputSinup = responseSinup.data;
	expect(outputSinup.message).toBe('Invalid name');
});

test("Não deve criar uma conta para o passageiro com email inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}`,
		cpf: "87748248800",
		isPassenger: true
	};

	const responseSinup = await axios.post("http://localhost:3000/signup", input);
	expect(responseSinup.status).toBe(422);
	const outputSinup = responseSinup.data;
	expect(outputSinup.message).toBe('Invalid email');
});

test("Não deve criar uma conta para o passageiro com conta existente", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};

	await axios.post("http://localhost:3000/signup", input)
	const responseSinup = await axios.post("http://localhost:3000/signup", input);
	expect(responseSinup.status).toBe(422);
	const outputSinup = responseSinup.data;
	expect(outputSinup.message).toBe('Account already exists');
});

test("Não deve criar uma conta para o passageiro com cpf inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "877482488",
		isPassenger: true
	};

	const responseSinup = await axios.post("http://localhost:3000/signup", input);
	expect(responseSinup.status).toBe(422);
	const outputSinup = responseSinup.data;
	expect(outputSinup.message).toBe('Invalid cpf');
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

	const responseSinup = await axios.post("http://localhost:3000/signup", input);
	expect(responseSinup.status).toBe(422);
	const outputSinup = responseSinup.data;
	expect(outputSinup.message).toBe('Invalid car plate');
});
