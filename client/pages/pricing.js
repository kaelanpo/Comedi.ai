import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import SubscriptionButton from '../components/SubscriptionButton';

const PRICE_IDS = {
  basic: 'price_basic_id',
  pro: 'price_pro_id',
  enterprise: 'price_enterprise_id'
};

export default function Pricing() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/status');
      const data = await response.json();
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12">Pricing Plans</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Basic Plan */}
        <div className="border rounded-lg p-8">
          <h2 className="text-2xl font-bold">Basic</h2>
          <p className="text-3xl font-bold mt-4">$10/month</p>
          <ul className="mt-6 space-y-3">
            <li>✓ Feature 1</li>
            <li>✓ Feature 2</li>
            <li>✓ Feature 3</li>
          </ul>
          <div className="mt-8">
            <SubscriptionButton
              priceId={PRICE_IDS.basic}
              isCurrentPlan={subscription?.price_id === PRICE_IDS.basic}
            />
          </div>
        </div>

        {/* Pro Plan */}
        <div className="border rounded-lg p-8 bg-blue-50">
          <h2 className="text-2xl font-bold">Pro</h2>
          <p className="text-3xl font-bold mt-4">$20/month</p>
          <ul className="mt-6 space-y-3">
            <li>✓ All Basic features</li>
            <li>✓ Pro Feature 1</li>
            <li>✓ Pro Feature 2</li>
          </ul>
          <div className="mt-8">
            <SubscriptionButton
              priceId={PRICE_IDS.pro}
              isCurrentPlan={subscription?.price_id === PRICE_IDS.pro}
            />
          </div>
        </div>

        {/* Enterprise Plan */}
        <div className="border rounded-lg p-8">
          <h2 className="text-2xl font-bold">Enterprise</h2>
          <p className="text-3xl font-bold mt-4">$50/month</p>
          <ul className="mt-6 space-y-3">
            <li>✓ All Pro features</li>
            <li>✓ Enterprise Feature 1</li>
            <li>✓ Enterprise Feature 2</li>
          </ul>
          <div className="mt-8">
            <SubscriptionButton
              priceId={PRICE_IDS.enterprise}
              isCurrentPlan={subscription?.price_id === PRICE_IDS.enterprise}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 