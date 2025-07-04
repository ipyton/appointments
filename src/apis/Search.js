import { URL } from "./URL";

export default class Search {
    static async getSuggestions(query) {
        return await fetch( URL + `/search/suggest?q=${query}&fuzzy=true&limit=5`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

    }
}