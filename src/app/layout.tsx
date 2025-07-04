import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import GlobalSearchButton from "@/components/GlobalSearchButton";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Appointments System",
  description: "Book and manage appointments with service providers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ChatProvider>
            <header className="bg-white border-b border-gray-200">
              <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-blue-600">
                  AppointEase
                </Link>
                
                <nav className="hidden md:flex items-center space-x-6">
                  <Link href="/search" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                    Search
                  </Link>
                  <Link href="/features" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                    Features
                  </Link>
                  <Link href="/pricing" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                    Pricing
                  </Link>
                </nav>
                
                <div className="flex items-center space-x-4">
                  {/* Example provider avatar - in a real app, this would be dynamic based on auth state */}
                  <UserAvatar 
                    id="4" 
                    name="StyleHub Salon" 
                    imageSrc="https://placehold.co/100x100?text=StyleHub"
                    size="sm"
                    isProvider={true}
                  />
                  
                  {/* Example client avatar */}
                  <UserAvatar 
                    id="user1" 
                    name="Jane Smith" 
                    imageSrc="https://placehold.co/100x100?text=Jane"
                    size="sm"
                  />
                </div>
              </div>
            </header>
            
            {children}
            
            <div className="fixed bottom-6 right-6 z-50">
              <GlobalSearchButton />
            </div>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
