const express = require("express");
const axios = require("axios");
const stripe = require("stripe")(
  "sk_test_51PJr9WSFTGzovtjLlmIlzOd6qec8FN49zBRylj51LUYxOkpnY4vE9gBP2Qr9Ee2mE6yKldRlh2gsYWFO1Tzhq52000ndogEHwv"
);
const bodyParser = require("body-parser");

// accessing .env content
const dotenv = require("dotenv");
dotenv.config();

// importing controllers
const productController = require("./src/controller/productsController");
const customerController = require("./src/controller/customerController");
const cartController = require("./src/controller/cartController");
const loginController = require("./src/controller/loginController");
const paymentController = require("./src/controller/paymentController");
const categoryController = require("./src/controller/categoryContoller");
const productTypeController = require("./src/controller/productTypeController");
const addProductController = require("./src/controller/addProductController");
const orderHistoryController = require("./src/controller/orderHistoryController")

const app = express();
const PORT = 5000;

// using body parser
app.use(bodyParser.json());

// Enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Demo Purpose
app.get("/", (req, res) => {
  res.json("Hello World");
});

// route handler for login - authenticate customer
app.post("/login", loginController.authenticateUser);

// Route handler for fetching products 
app.get("/products", productController.getProducts);

// Route handler for fetching customers
app.get("/customers", customerController.getCustomers);

// Route handler for adding customers
app.post("/customers", customerController.addCustomer);

// Checking if cart for customer exist or not
app.head("/carts", cartController.checkCartExists);

// Route handler for fetching cart details
app.get("/carts", cartController.getCartDetails);

// Route handler for updating items cart details 
app.post("/carts", cartController.updateCartDetails);
// Remove line items from cart
app.post("/removecart", cartController.removeLineItem)

// Route to stripe payment
app.post( "/api/create-checkout-session", paymentController.createCheckoutSession);

// delete cart after successful order
app.delete("/carts", cartController.deleteCartController);


// fetch all the categories of product
app.get('/categories', categoryController.getCallCategories);

// fetch all the product-type of product
app.get('/product-types', productTypeController.getAllProductType);


// Add product by users
app.post('/products', addProductController.addProduct);

//Add Shipping Address
app.post('/shipping-address', cartController.shippingAddressController)

// Add order after payment
app.post('/create-order', cartController.orderController)

//See order history
app.get('/orders/:customerId', orderHistoryController.orderHistory)


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
