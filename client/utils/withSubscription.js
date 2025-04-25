import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';

export function withSubscription(WrappedComponent) {
  return function SubscriptionProtectedComponent(props) {
    const router = useRouter();
    const user = useUser();
    const [loading, setLoading] = useState(true);
    const [hasSubscription, setHasSubscription] = useState(false);

    useEffect(() => {
      if (!user) {
        router.push('/login');
        return;
      }

      checkSubscription();
    }, [user]);

    const checkSubscription = async () => {
      try {
        const response = await fetch('/api/subscription/status');
        const data = await response.json();
        
        if (data.status !== 'active') {
          router.push('/pricing');
          return;
        }

        setHasSubscription(true);
      } catch (error) {
        console.error('Error checking subscription:', error);
        router.push('/pricing');
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!hasSubscription) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
} 