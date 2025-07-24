'use client'
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function HeroSection() {
  const router = useRouter(); // Initialize useRouter
  const handleGetStarted = () => {
    router.push('/qualified-leads'); // Navigate to /qualified-leads page
  };

  return (
    <div className="relative bg-white py-20 px-4 md:px-10 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-12">
        {/* Text Section */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-relaxed">
            HMSTR ai Dashboard
          </h1>
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