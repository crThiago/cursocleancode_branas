import express from "express";
import {Signup} from "../application/Signup";
import {GetAccount} from "../application/GetAccount";
import {AccountDAODatabase} from "../resource/AccountDAO";
import {MailerGatewayMemory} from "../resource/MailerGateway";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
    try {
        const accountDAO = new AccountDAODatabase();
        const mailGateway = new MailerGatewayMemory();
        const signup = new Signup(accountDAO, mailGateway);
        const output = await signup.execute(req.body);
        res.json(output);
    } catch (e: any) {
        res.status(422).json({message: e.message});
    }
});

app.get("/accounts/:accountId", async function (req, res) {
    const accountDAO = new AccountDAODatabase();
    const getAccount = new GetAccount(accountDAO);
    const input = {accountId: req.params.accountId}
    const account = await getAccount.execute(input);
    return res.json(account);
})

app.listen(3000);
