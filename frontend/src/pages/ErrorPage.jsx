
import React from 'react';
import { 
  Home, 
  ArrowLeft,
  RefreshCw 
} from 'lucide-react';
import { Link } from 'react-router';

export default function ErrorPage({ 
  code = "404", 
  title = "Page Not Found", 
  message = "Sorry, the page you're looking for doesn't exist or has been moved.",
  showHomeButton = true
}) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7] flex items-center justify-center font-sans p-6">
      <div className="max-w-lg w-full text-center">
        {/* Decorative Element */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-rose-100 rounded-full flex items-center justify-center">
              <span className="text-7xl opacity-20">🌸</span>
            </div>
            <div className="absolute -top-4 -right-4 text-8xl font-light text-rose-300">
              {code}
            </div>
          </div>
        </div>

        <h1 className="text-6xl font-semibold text-gray-900 mb-4">{code}</h1>
        <h2 className="text-3xl font-medium text-gray-800 mb-4">{title}</h2>
        
        <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md mx-auto">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {showHomeButton && (
            <Link
              to="/"
              className="flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-3xl hover:bg-black transition-all active:scale-95 font-medium"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          )}

          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-3 border border-gray-300 hover:bg-white px-8 py-4 rounded-3xl transition-all font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>

        <div className="mt-12">
          <Link 
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Home
          </Link>
        </div>

        {/* Soft decorative footer */}
        <div className="mt-16 text-xs text-gray-400">
          Glowify • A Ritual of Self-Care
        </div>
      </div>
    </div>
  );
}