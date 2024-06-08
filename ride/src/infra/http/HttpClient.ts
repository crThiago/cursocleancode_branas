import axios from "axios";
import fetch from "node-fetch";

export default interface HttpClient {
    post(url: string, body: any): Promise<any>;
    get(url: string): Promise<any>;
}

export class AxiosAdapter implements HttpClient {
    async get(url: string): Promise<any> {
        const response = await axios.get(url);
        return response.data;
    }

    async post(url: string, body: any): Promise<any> {
        const response = await axios.post(url, body);
        return response.data;
    }
}

export class FetchAdapter implements HttpClient {
    async get(url: string): Promise<any> {
        const response = await fetch(url);
        return response.json();
    }

    async post(url: string, body: any): Promise<any> {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        return response.json();
    }

}
