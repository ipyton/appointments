import { URL } from "./URL";

export default class Search {
    static async getSuggestions(query) {
        // Check if we're running in the browser before accessing localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        
        return await fetch( URL + `/search/suggest?q=${query}&fuzzy=true&limit=5`, {
            method: "GET",
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
    }
}