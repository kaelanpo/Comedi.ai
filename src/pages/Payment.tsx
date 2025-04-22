import React from 'react';
import { Link } from 'react-router-dom';

export default function Payment() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Payment & Billing</h1>
          
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <div className="space-y-6">
              {/* Current Plan */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-medium text-gray-900">Pro Plan</p>
                  <p className="text-sm text-gray-500">$29.99/month</p>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                <div className="mt-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4 4c0-1.1.9-2 2-2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                        </svg>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/24</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">Update</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing History */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Billing History</h2>
                <div className="mt-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mar 1, 2024</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$29.99</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Paid</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex space-x-4">
                <Link
                  to="/account"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Back to Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 