"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProfileLink from "@/components/ProfileLink";

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Featured providers data
  const featuredProviders = [
    {
      id: '4',
      name: 'StyleHub Salon',
      type: 'Provider',
      image: 'https://placehold.co/100x100?text=StyleHub',
      description: 'Premium hair styling and beauty treatments'
    },
    {
      id: '1',
      name: 'Haircut and Styling Service',
      type: 'Provider',
      image: 'https://placehold.co/100x100?text=Haircut',
      description: 'Professional haircut and styling service by expert stylists'
    },
    {
      id: '2',
      name: 'Beauty Salon Services',
      type: 'Provider',
      image: 'https://placehold.co/100x100?text=Beauty',
      description: 'Full-service beauty salon offering everything from facials to manicures'
    }
  ];

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen font-[family-name:var(--font-geist-sans)]">
      <header className="bg-white shadow p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Appointments Logo"
              width={120}
              height={30}
              priority
            />
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === "ServiceProvider" && (
                  <Link 
                    href="/provider"
                    className="text-green-600 hover:text-green-500 font-medium"
                  >
                    Provider Dashboard
                  </Link>
                )}
                {user.role === "User" && (
                  <Link 
                    href="/user"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    User Dashboard
                  </Link>
                )}
                <Link 
                  href="/profile"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  My Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-500 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Login
                </Link>
                <Link 
                  href="/register"
                  className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 pb-20 flex flex-col items-center justify-center">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Appointment Booking System</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            An easy way to book appointments with service providers. Register now as a user or service provider.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* User Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">For Users</h2>
            <p className="text-gray-600 text-center mb-6">
              Find and book appointments with service providers. Manage all your appointments in one place.
            </p>
            {!user && (
              <Link
                href="/register"
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-medium"
              >
                Register as User
              </Link>
            )}
          </div>

          {/* Service Provider Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">For Service Providers</h2>
            <p className="text-gray-600 text-center mb-6">
              Offer your services, manage bookings, and grow your business with our easy-to-use platform.
            </p>
            {!user && (
              <Link
                href="/register"
                className="rounded-full bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-medium"
              >
                Register as Provider
              </Link>
            )}
          </div>
        </div>

        {/* Featured Providers Section */}
        <div className="mt-16 w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Featured Providers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {featuredProviders.map(provider => (
              <Link key={provider.id} href={`/profiles/${provider.id}`} className="block">
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 h-full flex flex-col">
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-full overflow-hidden mr-4">
                      <Image
                        src={provider.image}
                        alt={provider.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{provider.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Provider
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 flex-grow">{provider.description}</p>
                  <div className="mt-4 text-sm text-blue-600 font-medium">View profile →</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/search" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              View All Providers
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Register</h3>
              <p className="text-gray-600 text-center">
                Create an account as a user or service provider.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Book or Manage</h3>
              <p className="text-gray-600 text-center">
                Book appointments or manage your services.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Enjoy</h3>
              <p className="text-gray-600 text-center">
                Enjoy the seamless appointment management experience.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Appointments Logo"
              width={100}
              height={24}
            />
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Terms</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
          </div>
          <div className="text-gray-600">
            © {new Date().getFullYear()} Appointments
          </div>
        </div>
      </footer>
    </div>
  );
} 