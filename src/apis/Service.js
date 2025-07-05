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
} 