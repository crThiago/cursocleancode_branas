import {AccountRepositoryDatabase} from "../src/infra/repository/AccountRepository";
import Account from "../src/domain/Account";
import {PgPromiseAdapter} from "../src/infra/database/DatabaseConnection";

let account: Account;
let accountRepository: AccountRepositoryDatabase;
let connection: PgPromiseAdapter;

beforeEach(async () => {
	account = Account.create(
		"John Doe",
		`john.doe${Math.random()}@gmail.com`,
		"87748248800",
		true,
		false,
		''
	);
	connection = new PgPromiseAdapter();
	accountRepository = new AccountRepositoryDatabase(connection);
});

afterEach(async () => {
	await connection.close();
})

test("Deve salvar um registro na tabela account e consultar por id", async function () {
	await accountRepository.saveAccount(account);
	const savedAccount = await accountRepository.getAccountById(account.accountId);
	expect(savedAccount.accountId).toBe(account.accountId);
	expect(savedAccount.name).toBe(account.name);
	expect(savedAccount.email).toBe(account.email);
	expect(savedAccount.cpf).toBe(account.cpf);
});

test("Deve salvar um registro na tabela account e consultar por email", async function () {
	await accountRepository.saveAccount(account);
	const savedAccount = await accountRepository.getAccountByEmail(account.email);
	expect(savedAccount?.accountId).toBe(account.accountId);
	expect(savedAccount?.name).toBe(account.name);
	expect(savedAccount?.email).toBe(account.email);
	expect(savedAccount?.cpf).toBe(account.cpf);
});
