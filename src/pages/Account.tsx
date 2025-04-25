
import { Link } from 'react-router-dom';

export default function Account() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <div className="space-y-6">
              {/* Profile Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
                <div className="mt-4 grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Subscription Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Subscription</h2>
                <div className="mt-4">
                  <Link
                    to="/payment"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Manage Subscription
                  </Link>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Back to Dashboard
                </Link>
                <Link
                  to="/privacy"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 