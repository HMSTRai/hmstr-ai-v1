'use client'
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function HeroSection() {
  const router = useRouter(); // Initialize useRouter
  const handleGetStarted = () => {
    router.push('/qlead-summary'); // Navigate to /qualified-leads page
  };

  return (
    <div className="relative bg-white py-20 px-4 md:px-10 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-12">
        {/* Text Section */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-relaxed">
            Welcome to HMSTR ai Dashboard
          </h1>
          <p className="text-lg md:text-l text-gray-600 mb-6 leading-relaxed">
            Track your metrics, analyze performance, and optimize your business with real-time insights.
          </p>
          <p className="text-sm text-gray-500 mb-6 leading-loose">
            HMSTR fixes all of it — automatically
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-orange-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-800 transition duration-300"
          >
            Get Started
          </button>
        </div>

        {/* Image Section */}
        <div className="flex-1 relative">
          <img
            src="/assets/images/all-img/HMSTR-Mascot-main.png"
            alt="HMSTR.ai Character"
            className="w-full max-w-md mx-auto object-contain"
          />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full filter blur-2xl opacity-30 -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-200 rounded-full filter blur-2xl opacity-30 -z-10 animate-pulse delay-200"></div>
    </div>
  );
}