import { URL } from "./URL";

export default class Auth {
    static async login(email, password, rememberMe) {
        const response = await fetch(`${URL}/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password, rememberMe }),
        });
    }

    static async register(email, password) {
        const response = await fetch(`${URL}/register`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    static async logout() {
        const response = await fetch(`${URL}/logout`, {
            method: 'POST',
        });
    }


    static async validateToken(token) {
        return fetch(`${URL}/token/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Token: token }),
        });
    }
}