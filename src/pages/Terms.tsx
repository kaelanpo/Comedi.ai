import React from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="prose prose-blue max-w-none">
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing and using Comedi.ai, you accept and agree to be bound by the terms and conditions of this agreement.
                </p>

                <h2>2. Use License</h2>
                <p>
                  Permission is granted to temporarily access Comedi.ai for personal, non-commercial use. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul>
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Attempt to decompile or reverse engineer any software</li>
                  <li>Remove any copyright or other proprietary notations</li>
                  <li>Transfer the materials to another person</li>
                </ul>

                <h2>3. Subscription and Payments</h2>
                <p>
                  By subscribing to our service, you agree to pay all fees associated with your subscription plan. Fees are non-refundable except as required by law or as explicitly stated in our refund policy.
                </p>

                <h2>4. User Content</h2>
                <p>
                  You retain all rights to any content you submit, post, or display on or through the service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and distribute such content.
                </p>

                <h2>5. Prohibited Activities</h2>
                <p>You agree not to:</p>
                <ul>
                  <li>Use the service for any illegal purpose</li>
                  <li>Violate any laws in your jurisdiction</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Interfere with or disrupt the service</li>
                  <li>Attempt to gain unauthorized access to any portion of the service</li>
                </ul>

                <h2>6. Disclaimer</h2>
                <p>
                  The materials on Comedi.ai are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>

                <h2>7. Limitations</h2>
                <p>
                  In no event shall Comedi.ai or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Comedi.ai.
                </p>

                <h2>8. Revisions</h2>
                <p>
                  We may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                </p>

                <h2>9. Contact</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at terms@comedi.ai
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