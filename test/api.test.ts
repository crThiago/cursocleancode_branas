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
