"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Appointment from "@/apis/Appointment";
import Service from "@/apis/Service";

// Interface for appointment data
interface AppointmentData {
  id: number;
  serviceId: number;
  userId: string;
  providerId: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
}

// Interface for service data
interface ServiceData {
  id: number;
  name: string;
  description: string;
  price: number;
  providerId: string;
  duration: number;
  image?: string;
}

// Interface for provider data
interface ProviderData {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phoneNumber: string | null;
}

// Mock event data (same as in events page)
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Dental Checkup",
    provider: "Dr. Smith",
    category: "Healthcare",
    description: "Regular dental checkup and cleaning.",
    duration: 30,
    price: 75,
    image: "https://placehold.co/600x400?text=Dental+Checkup",
    availableSlots: [
      { id: "1-1", date: "2023-06-15", time: "09:00 AM" },
      { id: "1-2", date: "2023-06-15", time: "10:00 AM" },
      { id: "1-3", date: "2023-06-15", time: "11:00 AM" },
      { id: "1-4", date: "2023-06-16", time: "09:00 AM" },
      { id: "1-5", date: "2023-06-16", time: "10:00 AM" },
      { id: "1-6", date: "2023-06-17", time: "14:00 PM" },
      { id: "1-7", date: "2023-06-17", time: "15:00 PM" },
    ]
  },
  {
    id: "2",
    title: "Haircut & Styling",
    provider: "Style Studio",
    category: "Beauty",
    description: "Professional haircut and styling services.",
    duration: 45,
    price: 50,
    image: "https://placehold.co/600x400?text=Haircut",
    availableSlots: [
      { id: "2-1", date: "2023-06-15", time: "09:00 AM" },
      { id: "2-2", date: "2023-06-15", time: "10:00 AM" },
      { id: "2-3", date: "2023-06-16", time: "14:00 PM" },
      { id: "2-4", date: "2023-06-16", time: "15:00 PM" },
    ]
  },
  {
    id: "3",
    title: "Yoga Class",
    provider: "Zen Yoga Center",
    category: "Fitness",
    description: "Beginner-friendly yoga class for relaxation and flexibility.",
    duration: 60,
    price: 25,
    image: "https://placehold.co/600x400?text=Yoga+Class",
    availableSlots: [
      { id: "3-1", date: "2023-06-15", time: "16:00 PM" },
      { id: "3-2", date: "2023-06-15", time: "18:00 PM" },
      { id: "3-3", date: "2023-06-16", time: "16:00 PM" },
      { id: "3-4", date: "2023-06-16", time: "18:00 PM" },
      { id: "3-5", date: "2023-06-17", time: "10:00 AM" },
      { id: "3-6", date: "2023-06-17", time: "16:00 PM" },
    ]
  },
  {
    id: "4",
    title: "Car Maintenance",
    provider: "Quick Auto Service",
    category: "Automotive",
    description: "Basic car maintenance including oil change and inspection.",
    duration: 60,
    price: 120,
    image: "https://placehold.co/600x400?text=Car+Maintenance",
    availableSlots: [
      { id: "4-1", date: "2023-06-15", time: "09:00 AM" },
      { id: "4-2", date: "2023-06-15", time: "11:00 AM" },
      { id: "4-3", date: "2023-06-16", time: "09:00 AM" },
      { id: "4-4", date: "2023-06-16", time: "11:00 AM" },
    ]
  },
  {
    id: "5",
    title: "House Cleaning",
    provider: "CleanHome Services",
    category: "Home Services",
    description: "Professional house cleaning service for all room types.",
    duration: 120,
    price: 100,
    image: "https://placehold.co/600x400?text=House+Cleaning",
    availableSlots: [
      { id: "5-1", date: "2023-06-15", time: "09:00 AM" },
      { id: "5-2", date: "2023-06-15", time: "13:00 PM" },
      { id: "5-3", date: "2023-06-16", time: "09:00 AM" },
      { id: "5-4", date: "2023-06-16", time: "13:00 PM" },
      { id: "5-5", date: "2023-06-17", time: "09:00 AM" },
    ]
  },
  {
    id: "6",
    title: "Financial Consultation",
    provider: "Money Matters Advisors",
    category: "Professional Services",
    description: "Personal financial planning and investment advice.",
    duration: 60,
    price: 150,
    image: "https://placehold.co/600x400?text=Financial+Consultation",
    availableSlots: [
      { id: "6-1", date: "2023-06-15", time: "10:00 AM" },
      { id: "6-2", date: "2023-06-15", time: "14:00 PM" },
      { id: "6-3", date: "2023-06-16", time: "10:00 AM" },
      { id: "6-4", date: "2023-06-16", time: "14:00 PM" },
      { id: "6-5", date: "2023-06-17", time: "10:00 AM" },
    ]
  }
];

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [service, setService] = useState<ServiceData | null>(null);
  const [provider, setProvider] = useState<ProviderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: user?.email || '',
    phone: '',
    specialRequests: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    if (!appointmentId) {
      router.push('/user/events');
      return;
    }
    
    const fetchAppointmentData = async () => {
      try {
        // In a real app, you would fetch the appointment data from your API
        // For now, we'll simulate this with a timeout
        setTimeout(async () => {
          // Simulate appointment data
          const mockAppointment = {
            id: parseInt(appointmentId),
            serviceId: 1, // This would come from your API
            userId: user?.id || '',
            providerId: 'provider-123',
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
            status: 'pending',
            createdAt: new Date().toISOString()
          };
          
          setAppointment(mockAppointment);
          
          // Fetch service details
          try {
            const serviceResponse = await Service.getEventById(mockAppointment.serviceId);
            const serviceData = await serviceResponse.json();
            setService(serviceData.service);
            setProvider(serviceData.provider);
          } catch (error) {
            console.error("Error fetching service details:", error);
          }
          
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching appointment data:", error);
        setLoading(false);
      }
    };
    
    fetchAppointmentData();
  }, [appointmentId, router, user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service || !appointment) {
      return;
    }
    
    setIsProcessing(true);
    
    // Prepare payment data
    const paymentData = {
      paymentMethod,
      amount: service.price * 1.1, // Including tax
      currency: 'USD',
      contactInfo: {
        email: formData.email,
        phone: formData.phone
      },
      specialRequests: formData.specialRequests,
      cardDetails: paymentMethod === 'card' ? {
        cardNumber: formData.cardNumber,
        cardName: formData.cardName,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv
      } : undefined,
      serviceDetails: {
        serviceId: service.id,
        serviceName: service.name,
        providerId: provider?.id,
        providerName: provider?.businessName || provider?.fullName,
        duration: service.duration,
        startTime: appointment.startTime,
        endTime: appointment.endTime
      }
    };

    try {
      // Call the payment API
      const response = await Appointment.payAppointment(appointment.id, paymentData);
      
      if (response.ok) {
        // Redirect to success page
        router.push('/user/bookings');
      } else {
        // Handle error
        const errorData = await response.json();
        console.error("Payment failed:", errorData);
        alert("Payment failed. Please try again.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred during payment. Please try again.");
      setIsProcessing(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading checkout...</p>
      </div>
    );
  }
  
  if (!service || !appointment) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Invalid Booking Request</h1>
        <p className="text-gray-600 mb-6">The appointment you're trying to pay for is not valid.</p>
        <Link href="/user/events" className="text-blue-600 hover:underline">
          Browse events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  src={service.image || "https://placehold.co/600x400?text=" + encodeURIComponent(service.name)} 
                  alt={service.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{service.name}</h3>
                <p className="text-gray-600 text-sm">Provided by {provider?.businessName || provider?.fullName}</p>
                <div className="mt-2 text-sm">
                  <p>Date: {new Date(appointment.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p>Time: {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(appointment.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p>Duration: {service.duration || Math.round((new Date(appointment.endTime).getTime() - new Date(appointment.startTime).getTime()) / 60000)} minutes</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Payment Method</h3>
              
              <div className="flex gap-4 mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mr-2"
                  />
                  <span>Credit Card</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="mr-2"
                  />
                  <span>PayPal</span>
                </label>
              </div>
              
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'paypal' && (
                <div className="text-center p-6 border border-gray-200 rounded-md">
                  <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto mx-auto" viewBox="0 0 124 33">
                    <path fill="#253B80" d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z" />
                    <path fill="#179BD7" d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z" />
                    <path fill="#253B80" d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2c-.696.494-1.523.869-2.458 1.109-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z" />
                    <path fill="#179BD7" d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z" />
                    <path fill="#222D65" d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.429 9.045 9.045 0 0 0-.277-.087z" />
                    <path fill="#253B80" d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.429.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>${service.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>${(service.price * 0.1).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-3 mb-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${(service.price * 1.1).toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Complete Booking'}
            </button>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              By completing this booking, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}