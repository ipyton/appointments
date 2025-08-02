import { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service | AppointEase",
  description: "Terms of Service for AppointEase - Understanding our terms and conditions",
};

export default function TermsOfService() {
  const lastUpdated = new Date().toLocaleDateString();
  
  return (
    <LegalLayout title="Terms of Service" lastUpdated={lastUpdated}>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing or using AppointEase, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, then you may not access the service. These Terms of Service apply to all visitors, users, and others who wish to access or use the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
        <p>
          AppointEase provides an online platform for scheduling and managing appointments between service providers and clients. The service includes features such as calendar management, appointment booking, notifications, and payment processing. We reserve the right to modify or discontinue, temporarily or permanently, the Service with or without notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
        <p>
          When you create an account with us, you guarantee that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the Service.
        </p>
        <p className="mt-2">
          You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
        <p>
          The Service and its original content, features, and functionality are and will remain the exclusive property of AppointEase and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of AppointEase.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
        <p>
          We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
        </p>
        <p className="mt-2">
          If you wish to terminate your account, you may simply discontinue using the Service, or notify us that you wish to delete your account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
        <p>
          In no event shall AppointEase, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <p className="mt-2">
          <strong>Email</strong>: legal@appointease.com<br />
          <strong>Address</strong>: AppointEase Headquarters, 123 Appointment Street, Scheduler City, SC 12345
        </p>
      </section>
    </LegalLayout>
  );
} 