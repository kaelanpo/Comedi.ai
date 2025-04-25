import { useEffect } from 'react';

export default function Payment() {
  useEffect(() => {
    // Redirect to Stripe payment link
    window.location.href = 'https://buy.stripe.com/3cs1463x6g2Hbok9AA';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Redirecting to secure payment...
          </h2>
          <p className="text-gray-600">
            Please wait while we redirect you to our secure payment processor.
          </p>
        </div>
      </div>
    </div>
  );
} 