import { URL } from './URL';

export default class Calendar {
  static async getCalendar(date, type = "month") {
    const token = localStorage.getItem("token");
    
    let formattedDate;
    if (date instanceof Date) {
      // Format as YYYY-MM-DD with month from 1-12
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Convert from 0-11 to 1-12
      const day = date.getDate();
      formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    } else {
      formattedDate = date;
    }
    
    return fetch(`${URL}/calendar/get?date=${formattedDate}&type=${type}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      }
    });
  }
}