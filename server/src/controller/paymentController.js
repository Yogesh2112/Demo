const paymentService = require('../services/paymentService');

const createCheckoutSession = async (req, res) => {
  try {
    const { carts } = req.body;
    console.log("heeloo srtiyo",{carts})
    const sessionId = await paymentService.createCheckoutSession(carts);
    res.json({ id: sessionId });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCheckoutSession,
};
