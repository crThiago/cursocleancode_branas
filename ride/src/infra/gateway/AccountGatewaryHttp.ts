import AccountGateway, {OutputSignup} from "../../application/gateway/AccountGateway";
import HttpClient from "../http/HttpClient";

export default class AccountGatewaryHttp implements AccountGateway {
    public constructor (readonly httpClient: HttpClient) {}
    async signup(account: any): Promise<OutputSignup> {
        const response = await this.httpClient.post('http://localhost:3002/signup', account);
        return response;
    }
    async getAccountById(accountId: string): Promise<any> {
        const response = await this.httpClient.get(`http://localhost:3002/accounts/${accountId}`);
        return response;
    }
}
