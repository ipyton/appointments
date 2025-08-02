import { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | AppointEase",
  description: "Privacy Policy for AppointEase - Learn how we collect, use, and protect your data",
};

export default function PrivacyPolicy() {
  const lastUpdated = new Date().toLocaleDateString();
  
  return (
    <LegalLayout title="Privacy Policy" lastUpdated={lastUpdated}>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p>
          Welcome to AppointEase. We respect your privacy and are committed to protecting your personal data.
          This privacy policy will inform you about how we look after your personal data when you visit our website
          and tell you about your privacy rights and how the law protects you.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. The Data We Collect</h2>
        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li><strong>Identity Data</strong>: includes first name, last name, username or similar identifier.</li>
          <li><strong>Contact Data</strong>: includes email address and telephone numbers.</li>
          <li><strong>Technical Data</strong>: includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
          <li><strong>Profile Data</strong>: includes your username and password, appointments made by you, your interests, preferences, feedback, and survey responses.</li>
          <li><strong>Usage Data</strong>: includes information about how you use our website, products, and services.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
          <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
          <li>Where we need to comply with a legal obligation.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
        <p>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
          In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Your Legal Rights</h2>
        <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Request access to your personal data.</li>
          <li>Request correction of your personal data.</li>
          <li>Request erasure of your personal data.</li>
          <li>Object to processing of your personal data.</li>
          <li>Request restriction of processing your personal data.</li>
          <li>Request transfer of your personal data.</li>
          <li>Right to withdraw consent.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our privacy practices, please contact us at:
        </p>
        <p className="mt-2">
          <strong>Email</strong>: privacy@appointease.com<br />
          <strong>Address</strong>: AppointEase Headquarters, 123 Appointment Street, Scheduler City, SC 12345
        </p>
      </section>
    </LegalLayout>
  );
} 