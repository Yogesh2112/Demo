const client = require("../middleware/commercetools");

// Fetch order history from CommerceTools
async function fetchOrderHistory(customerId) {
  try {
    const response = await client.execute({
      method: "GET",
      uri: "/handicraft/orders",
    });

    
    const orderHistory = response.body.results.filter(order => order.customerId === customerId);
    console.log("hello from service ",orderHistory)
    return orderHistory;

  } catch (error) {
    console.error("Error fetching order history:", error);
    throw error;
  }
}

module.exports = {
  fetchOrderHistory,
};
