import React from 'react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="prose prose-blue max-w-none">
                <h2>1. Introduction</h2>
                <p>
                  At Comedi.ai, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                </p>

                <h2>2. Information We Collect</h2>
                <p>We collect information that you provide directly to us, including:</p>
                <ul>
                  <li>Account information (name, email, password)</li>
                  <li>Payment information</li>
                  <li>Usage data and preferences</li>
                  <li>Communication data</li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide and maintain our service</li>
                  <li>Process your payments</li>
                  <li>Send you updates and marketing communications</li>
                  <li>Improve our service</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2>4. Information Sharing</h2>
                <p>
                  We do not sell or rent your personal information to third parties. We may share your information with:
                </p>
                <ul>
                  <li>Service providers who assist in our operations</li>
                  <li>Law enforcement when required by law</li>
                  <li>Other parties with your consent</li>
                </ul>

                <h2>5. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
                </p>

                <h2>6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>

                <h2>7. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at privacy@comedi.ai
                </p>
              </div>

              <div className="mt-8">
                <Link
                  to="/"
                  className="text-blue-600 hover:text-blue-500"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 