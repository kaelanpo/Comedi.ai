const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { supabase } = require('../utils/supabaseClient');
const { activeSubExists, createPortalSession, updateSupabaseSubscription } = require('../utils/stripeHelpers');
const auth = require('../middleware/auth');

// Create a subscription checkout session
router.post('/create-checkout', auth, async (req, res) => {
  try {
    const { priceId } = req.body;
    
    // Get user's profile from Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', req.user.id)
      .single();

    // Check for existing active subscription
    if (await activeSubExists(profile.stripe_customer_id, priceId)) {
      return res.status(409).json({ error: 'already-subscribed' });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: profile.stripe_customer_id,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing?canceled=true`,
      metadata: {
        userId: req.user.id
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Create customer portal session
router.post('/create-portal', auth, async (req, res) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', req.user.id)
      .single();

    const portalSession = await createPortalSession(profile.stripe_customer_id);
    res.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

// Get subscription status
router.get('/status', auth, async (req, res) => {
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('status', 'active')
      .maybeSingle();

    res.json(subscription || { status: 'inactive' });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
});

module.exports = router; 