const orderHistoryService = require('../services/orderHistoryService');

const orderHistory = async (req, res) => {
  const { customerId } = req.params;

  try {
    const orderData = await orderHistoryService.fetchOrderHistory(customerId);
    console.log("Order retrieved:", orderData);

    res.status(200).json({ message: 'Order history retrieved successfully!', order: orderData });
  } catch (error) {
    console.error("Error retrieving order history:", error);
    res.status(500).json({ message: 'Error retrieving order history', error: error.message });
  }
};

module.exports = {
  orderHistory
};
