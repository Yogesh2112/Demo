const client = require("../middleware/commercetools");

// fetching products from commercetools
async function fetchProducts() {
  try {
    const response = await client.execute({
      method: "GET",
      uri: "/handicraft/products",
    });
    return response.body.results;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

module.exports = {
  fetchProducts,
};
