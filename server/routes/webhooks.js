const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { updateSupabaseSubscription } = require('../utils/stripeHelpers');
const { supabase } = require('../utils/supabase');

// Verify Stripe webhook signature
const verifyStripeWebhook = (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    req.stripeEvent = event;
    next();
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

// Stripe webhook handler
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const subId = session.subscription;

        // Get the full subscription details
        const subscription = await stripe.subscriptions.retrieve(subId, {
          expand: ['items']
        });

        // Update Supabase with the new subscription
        await updateSupabaseSubscription(userId, subscription);
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // Get the user ID from Supabase using the subscription ID
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_sub_id', subscription.id)
          .single();

        if (sub) {
          await updateSupabaseSubscription(sub.user_id, subscription);
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = router; 