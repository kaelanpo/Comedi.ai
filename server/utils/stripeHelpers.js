const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { supabase } = require('./supabaseClient');

// Check if an active subscription exists for the customer and price
async function activeSubExists(stripeCustomerId, priceId) {
  const list = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    status: 'active',
    expand: ['data.items']
  });

  return list.data.some(sub =>
    sub.items.data.some(item => item.price.id === priceId)
  );
}

// Create a customer portal session
async function createPortalSession(stripeCustomerId) {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.CLIENT_URL}/dashboard`
  });
  return session;
}

// Update Supabase subscription data
async function updateSupabaseSubscription(userId, subData) {
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_sub_id: subData.id,
      price_id: subData.items.data[0].price.id,
      status: subData.status,
      current_period_end: new Date(subData.current_period_end * 1000).toISOString()
    });

  if (error) {
    console.error('Error updating Supabase subscription:', error);
    throw error;
  }
}

module.exports = {
  activeSubExists,
  createPortalSession,
  updateSupabaseSubscription
}; 