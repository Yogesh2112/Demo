// controllers/productController.js

const productService = require('../services/addProductService');

const addProduct = (req, res) => {
  console.log("product request",req.body)
  try {
    const productData = productService.createProduct(req.body);
    console.log("Product saved:", productData);
    // console.log("Shruti response ", res.status());
    
    res.status(201).json({ message: 'Product added successfully!', product: productData });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

module.exports = {
  addProduct
};
