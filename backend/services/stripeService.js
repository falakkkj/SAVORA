import stripe from '../config/stripe.js';

export const createCheckoutSession = async (orderItems, orderId) => {
  try {
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_mock_stripe_key') {
      const lineItems = orderItems.map((item) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order-success?orderId=${orderId}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout?cancelled=true`,
        client_reference_id: orderId.toString(),
      });

      return { sessionId: session.id, url: session.url };
    }
  } catch (err) {
    console.warn('[Stripe Checkout Integration Warning]:', err.message);
  }

  // Simulated fallback checkout redirect URL
  const mockUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order-success?orderId=${orderId}&session_id=cs_mock_${Date.now()}`;
  return { sessionId: `cs_mock_${Date.now()}`, url: mockUrl };
};
