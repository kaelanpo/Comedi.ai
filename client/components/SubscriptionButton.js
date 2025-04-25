import { useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';

export default function SubscriptionButton({ priceId, isCurrentPlan }) {
  const [loading, setLoading] = useState(false);
  const user = useUser();

  const handleSubscription = async () => {
    try {
      setLoading(true);

      if (isCurrentPlan) {
        // Open customer portal to manage subscription
        const response = await fetch('/api/subscription/create-portal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const { url } = await response.json();
        window.location.href = url;
      } else {
        // Create new subscription
        const response = await fetch('/api/subscription/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ priceId })
        });

        if (response.status === 409) {
          alert('You already have an active subscription to this plan.');
          return;
        }

        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscription}
      disabled={loading || !user}
      className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {loading ? (
        'Loading...'
      ) : isCurrentPlan ? (
        'Manage Subscription'
      ) : (
        'Subscribe'
      )}
    </button>
  );
} 