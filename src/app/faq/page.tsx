"use client";

import Link from "next/link";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
  isOpen?: boolean;
}

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      question: "What is AppointEase?",
      answer: "AppointEase is a comprehensive appointment scheduling platform that connects service providers with clients. It allows businesses to manage their availability, services, and bookings while enabling clients to easily find and book appointments with their preferred service providers.",
      isOpen: true
    },
    {
      question: "How do I create an account?",
      answer: "You can create an account by clicking the 'Register' button in the top navigation bar. You'll be asked to choose between registering as a service provider or as a client. Fill in your details, verify your email address, and you're ready to go!",
      isOpen: false
    },
    {
      question: "Is AppointEase free to use?",
      answer: "AppointEase offers a free plan with limited features for individuals just getting started. For businesses and professionals who need more advanced features, we offer affordable Professional and Enterprise plans. You can view our pricing details on the Pricing page.",
      isOpen: false
    },
    {
      question: "How do I schedule an appointment?",
      answer: "As a client, you can browse available service providers, select a service, choose an available time slot, and book your appointment. The system will send you confirmation and reminder notifications to ensure you don't miss your appointment.",
      isOpen: false
    },
    {
      question: "How do I manage my availability as a service provider?",
      answer: "After logging in as a provider, you can access your calendar from your dashboard. You can set your regular working hours, block off time for breaks or vacations, and manage your service offerings. The system will only show available slots to potential clients based on your settings.",
      isOpen: false
    },
    {
      question: "Can I reschedule or cancel an appointment?",
      answer: "Yes, both clients and service providers can reschedule or cancel appointments according to the cancellation policy set by the provider. Clients can manage their bookings from their account dashboard, and providers can manage all appointments from their provider dashboard.",
      isOpen: false
    },
    {
      question: "Does AppointEase send reminders?",
      answer: "Yes, AppointEase automatically sends email reminders to both clients and providers about upcoming appointments. Premium plans also include SMS reminders to reduce no-shows and keep everyone on schedule.",
      isOpen: false
    },
    {
      question: "Can I accept payments through AppointEase?",
      answer: "Yes, our Professional and Enterprise plans include online payment processing. You can collect full payments, deposits, or cancellation fees directly through the platform, making the transaction process seamless for both you and your clients.",
      isOpen: false
    },
    {
      question: "Is my data secure with AppointEase?",
      answer: "Absolutely. We take data security very seriously. All personal and payment information is encrypted and stored securely. We comply with industry standards for data protection and never share your information with third parties without your consent.",
      isOpen: false
    },
    {
      question: "Can I integrate AppointEase with my existing website?",
      answer: "Yes, our Professional and Enterprise plans allow you to embed the booking widget directly into your existing website. We also offer API access for custom integrations on the Enterprise plan.",
      isOpen: false
    },
    {
      question: "What if I need help using AppointEase?",
      answer: "We offer comprehensive documentation and tutorials to help you get started. Additionally, all users have access to our support team via email. Enterprise plan users also receive priority support with faster response times and dedicated account managers.",
      isOpen: false
    },
    {
      question: "Can I try AppointEase before committing to a paid plan?",
      answer: "Yes, we offer a 14-day free trial on all paid plans so you can explore all the features before making a decision. No credit card is required to start your trial.",
      isOpen: false
    }
  ]);

  const toggleFAQ = (index: number) => {
    setFaqs(faqs.map((faq, i) => {
      if (i === index) {
        return { ...faq, isOpen: !faq.isOpen };
      }
      return faq;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-600">AppointEase</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/features"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/pricing"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Pricing
            </Link>
            <Link 
              href="/faq"
              className="text-blue-600 font-medium"
            >
              FAQ
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/login"
              className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Find answers to common questions about AppointEase and how it can help streamline your appointment scheduling.
          </p>
        </div>
      </header>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                  <svg 
                    className={`w-5 h-5 text-blue-600 transform ${faq.isOpen ? 'rotate-180' : ''} transition-transform`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {faq.isOpen && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Still Have Questions?</h2>
          <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
            Our support team is here to help. Contact us and we'll get back to you as soon as possible.
          </p>
          <Link 
            href="#"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-xl font-bold mb-4">AppointEase</h3>
              <p className="text-gray-400 max-w-xs">
                The simplest way to schedule and manage appointments for your business.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AppointEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 