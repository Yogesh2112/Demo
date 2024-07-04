const productService = require('../services/productService');

async function getProducts(req, res) {
  try {
    const products = await productService.fetchProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
}

module.exports = {
  getProducts,
};
