export default interface AccountGateway {
    signup(account: any): Promise<OutputSignup>
    getAccountById(accountId: string): Promise<any>
}

export type OutputSignup = {
    accountId: string
}
