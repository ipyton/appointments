import { URL } from './URL';

export default class Calendar {
  static async getCalendar(date, type = "month") {
    const token = localStorage.getItem("token");
    const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : date;
    
    return fetch(`${URL}/calendar/get?date=${formattedDate}&type=${type}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      }
    });
  }
}