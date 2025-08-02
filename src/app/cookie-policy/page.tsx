import { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Cookie Policy | AppointEase",
  description: "Cookie Policy for AppointEase - How we use cookies on our website",
};

export default function CookiePolicy() {
  const lastUpdated = new Date().toLocaleDateString();
  
  return (
    <LegalLayout title="Cookie Policy" lastUpdated={lastUpdated}>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p>
          This Cookie Policy explains how AppointEase ("we", "us", or "our") uses cookies and similar technologies on our website.
          By using our website, you consent to the use of cookies as described in this Cookie Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. What Are Cookies?</h2>
        <p>
          Cookies are small text files that are placed on your device when you visit a website.
          They are widely used to make websites work more efficiently and provide information to the website owners.
          Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device when you go offline,
          while session cookies are deleted as soon as you close your web browser.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. How We Use Cookies</h2>
        <p>We use cookies for the following purposes:</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>
            <strong>Essential Cookies</strong>: These are necessary for the website to function properly.
            They enable basic functions like page navigation and access to secure areas of the website.
            The website cannot function properly without these cookies.
          </li>
          <li>
            <strong>Preference Cookies</strong>: These cookies enable our website to remember information that changes
            the way the website behaves or looks, like your preferred language or the region you are in.
          </li>
          <li>
            <strong>Analytics Cookies</strong>: These cookies help us understand how visitors interact with our website
            by collecting and reporting information anonymously. They help us improve the way our website works.
          </li>
          <li>
            <strong>Marketing Cookies</strong>: These cookies are used to track visitors across websites.
            The intention is to display ads that are relevant and engaging for the individual user.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Types of Cookies We Use</h2>
        <h3 className="text-xl font-semibold mt-4 mb-2">First-Party Cookies</h3>
        <p>
          These are cookies that are set by our website. They are primarily used to keep you logged in and
          remember your preferences for our site.
        </p>
        <h3 className="text-xl font-semibold mt-4 mb-2">Third-Party Cookies</h3>
        <p>
          These are cookies set by third parties that we use on our website. These include:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Google Analytics: Used to collect information about how visitors use our site.</li>
          <li>Social Media Cookies: Enable integration with social media platforms.</li>
          <li>Payment Processor Cookies: Used to process transactions on our platform.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
        <p>
          Most web browsers allow you to control cookies through their settings. You can:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Delete all cookies from your browser</li>
          <li>Block all cookies by activating settings on your browser</li>
          <li>Block specific cookies by adjusting your browser settings</li>
          <li>Allow or block cookies on a site-by-site basis</li>
        </ul>
        <p className="mt-2">
          Please note that restricting cookies may impact the functionality of our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Changes to This Cookie Policy</h2>
        <p>
          We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new 
          Cookie Policy on this page. You are advised to review this Cookie Policy periodically for any changes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
        <p>
          If you have any questions about our Cookie Policy, please contact us at:
        </p>
        <p className="mt-2">
          <strong>Email</strong>: privacy@appointease.com<br />
          <strong>Address</strong>: AppointEase Headquarters, 123 Appointment Street, Scheduler City, SC 12345
        </p>
      </section>
    </LegalLayout>
  );
} 