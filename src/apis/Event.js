import { URL } from "./URL";

export default class Event {
  static async createEvent(eventData) {
    // Check if we're running in the browser before accessing localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    return fetch(`${URL}/event/create`, {
      method: 'POST',
      body: JSON.stringify(eventData),
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
  }

  static async updateEvent(eventId, eventData) {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    return fetch(`${URL}/event/${eventId}/update`, {
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
    
    return fetch(`${URL}/event/list`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
  }

  static async getEventById(eventId) {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    return fetch(`${URL}/event/${eventId}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
  }

  static async deleteEvent(eventId) {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    return fetch(`${URL}/event/${eventId}/delete`, {
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

    return fetch(`${URL}/event/${eventId}/upload-image`, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
  }
} 