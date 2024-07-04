const stripe = require("stripe")("sk_test_51PJr9WSFTGzovtjLlmIlzOd6qec8FN49zBRylj51LUYxOkpnY4vE9gBP2Qr9Ee2mE6yKldRlh2gsYWFO1Tzhq52000ndogEHwv")

const createCheckoutSession = async (carts) => {
  // const totalInCents = Math.round(totalAmount * 100);
  console.log("hello carts",carts)
  const lineItems = carts.map((product) => ({
    
    price_data: {
      currency: 'inr',
      product_data: {
        name: product.name,
        description: product.description,
        images: [product.imageUrl],
      },
      unit_amount: product.price*100,
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    billing_address_collection: 'required',
    mode: 'payment',
    success_url: 'http://localhost:3000/order-confirm',
    cancel_url: 'http://localhost:3000'
  });

  return session.id;
};

module.exports = {
  createCheckoutSession,
};
