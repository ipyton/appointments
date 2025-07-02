import { URL } from "./URL";

export default class Templates {
    static async upsertTemplate(template) {
    return fetch(`${URL}/template/upsert`, {
        method: 'PUT',
        body: JSON.stringify(template),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    }
}