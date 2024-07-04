const client = require("../middleware/commercetools");

// fetching categories
async function fetchProductType() {
  try {
    const response = await client.execute({
      method: "GET",
      uri: '/handicraft/product-types',
    });
    console.log("product type", response);
    return response.body;
  } catch (error) {
    throw error.body;
  }
}



module.exports = {
    fetchProductType
};