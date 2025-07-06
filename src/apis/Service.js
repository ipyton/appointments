import { URL } from "./URL";

export default class Service {
  static async createService(serviceData) {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    return fetch(`${URL}/services/create`, {
      method: 'POST',
      body: JSON.stringify(serviceData),
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
  }

  static async updateEvent(eventId, eventData) {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    return fetch(`${URL}/services/${eventId}/update`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
  }

  static async getServicesByPage(page) {
    const token = localStorage.getItem("token") ;
    
    return fetch(`${URL}/services/paged?page=${page}`, {
      method: 'GET',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
  }

  static async getEvents() {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    return fetch(`${URL}/services/get-all`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
  }

  static async getEventById(eventId) {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    return fetch(`${URL}/services/${eventId}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
  }

  static async deleteEvent(eventId) {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    return fetch(`${URL}/services/${eventId}/delete`, {
      method: 'DELETE',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
  }

  static async uploadEventImage(eventId, imageFile) {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    const formData = new FormData();
    formData.append('image', imageFile);

    return fetch(`${URL}/services/${eventId}/upload-image`, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
  }


  static async getSlotsByDate(date, serviceId) {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    return fetch(`${URL}/services/slots-by-date?date=${date}&serviceId=${serviceId}`, {
      method: 'GET',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
  }

  static async getSlotsByMonth(year, month, serviceId) {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    return fetch(`${URL}/services/slots-by-month?year=${year}&month=${month}&serviceId=${serviceId}`, {
      method: 'GET',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
  }

} 