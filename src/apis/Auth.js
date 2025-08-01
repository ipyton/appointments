import { stringify } from "querystring";
import { URL } from "./URL";

export default class Auth {
    static async login(email, password, rememberMe, role) {
        const response = await fetch(`${URL}/account/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password, rememberMe, role }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    }

    static async register(email, password,role) {
        const response = await fetch(`${URL}/account/register`, {
            method: 'POST',
            body: JSON.stringify({ email, password, role}),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    }

    static async logout() {
        const response = await fetch(`${URL}/account/logout`, {
            method: 'POST',
        });
        return response;
    }

    static async googleLogin(idToken, role) {
        try {
            // Send the ID token to the backend
            const response = await fetch(`${URL}/account/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    token: idToken,
                    tokenType: 'id_token',
                    role
                }),
            });
            return response;
        } catch (error) {
            console.error("Google login error:", error);
            throw error;
        }
    }

    static async githubLogin(code, role) {
        try {
            const response = await fetch(`${URL}/account/github`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    code,
                    clientSecret: 'Ov23licOT0M7CAklIRJa',
                    role
                }),
            });
            return response;
        } catch (error) {
            console.error("GitHub login error:", error);
            throw error;
        }
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