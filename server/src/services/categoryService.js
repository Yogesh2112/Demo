const client = require("../middleware/commercetools");

// fetching categories
async function fetchCategories() {
  try {
    const response = await client.execute({
      method: "GET",
      uri: '/handicraft/categories',
    });
    console.log("categoryhelloservice", response);
    return response.body;
  } catch (error) {
    console.error("Error fetching categories:", error.body);
    throw error.body;
  }
}



module.exports = {
  fetchCategories
};