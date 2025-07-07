import { URL } from "./URL";

export default class Appointment {
  static async createAppointment(appointmentData) {
    const token = localStorage.getItem("token");
    return fetch(`${URL}/appointments/create`, {
      method: "POST",
      body: JSON.stringify(appointmentData),
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      }
    });
  }

  static async bookAppointment(serviceId, startTime, templateId, slotId, dayId, segmentId, notes, contactEmail, contactPhone) {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    return fetch(`${URL}/appointment/book`, {
      method: "POST",
      body: JSON.stringify({
        serviceId,
        startTime,
        templateId,
        slotId,
        dayId,
        segmentId,
        notes,
        contactEmail,
        contactPhone
      }),
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      }
    });
  }
  
  static async payAppointment(appointmentId, paymentDetails) {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    const requestBody = {
      appointmentId,
      ...paymentDetails
    };
    
    console.log("Payment request payload:", JSON.stringify(requestBody, null, 2));
    
    return fetch(`${URL}/appointment/pay`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      }
    });
  }

  static async getAppointments() {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    return fetch(`${URL}/appointment/getClientAppointments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      }
    });
  }

  static async cancelAppointment(bookingId) {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    return fetch(`${URL}/appointment/cancel`, {
      method: "POST",
      body: JSON.stringify({ bookingId }),
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      }
    });
  }
}