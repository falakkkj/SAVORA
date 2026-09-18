import Stripe from 'stripe';

const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_stripe_key';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[Stripe Config Warning] STRIPE_SECRET_KEY environment variable is missing. Initializing Stripe client with test key placeholder.');
}

export const stripe = new Stripe(apiKey, {
  apiVersion: '2023-10-16',
});

export default stripe;
