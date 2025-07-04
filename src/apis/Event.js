import { URL } from "./URL";

export default class Event {
  static async createEvent(eventData) {
    return fetch(`${URL}/event/create`, {
      method: 'POST',
      body: JSON.stringify(eventData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  static async updateEvent(eventId, eventData) {
    return fetch(`${URL}/event/${eventId}/update`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  static async getEvents() {
    return fetch(`${URL}/event/list`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  static async getEventById(eventId) {
    return fetch(`${URL}/event/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  static async deleteEvent(eventId) {
    return fetch(`${URL}/event/${eventId}/delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  static async uploadEventImage(eventId, imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    return fetch(`${URL}/event/${eventId}/upload-image`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
} 