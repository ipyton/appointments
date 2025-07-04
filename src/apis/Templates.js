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

    static async getTemplates() {
        return fetch(`${URL}/template/get`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    static async getNames() {
        return fetch(`${URL}/template/getNames`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    static async getTemplateById(id) {
        return fetch(`${URL}/template/get/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }
}