import Link from "next/link";
import { ReactNode } from "react";

interface LegalLayoutProps {
  children: ReactNode;
  title: string;
  lastUpdated?: string;
}

export default function LegalLayout({ children, title, lastUpdated }: LegalLayoutProps) {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>
        <div className="prose max-w-none">
          {lastUpdated && (
            <p className="text-gray-600 mb-4">Last Updated: {lastUpdated}</p>
          )}
          
          {children}

          <div className="mt-10 border-t pt-6 flex space-x-6">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Return to Home
            </Link>
            <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-800">
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="text-blue-600 hover:text-blue-800">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 