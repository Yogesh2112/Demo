const cartService = require("../services/cartService");
const { deleteCart } = require("../services/cartService");


let storedCartId;
let storedCartVersion;
// get cart details of customer
async function getCartDetails(req, res) {
  try {
    const customerId = req.query.customerId;
    const cartdetails = await cartService.fetchCartDetails(customerId);
    res.json(cartdetails);
    storedCartId = cartdetails.id;
    storedCartVersion = cartdetails.version;
    // console.log("controller cart",cartdetails)
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

// update cart details of customer
async function updateCartDetails(req, res) {
  const { customerId, productId,quantity } = req.body;
  try {
    const cartData = await cartService.fetchCartDetails(customerId);
    const { id: cartId, version: cartVersion } = cartData;

    await cartService.updateCart(cartId, cartVersion, productId,quantity);
    res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    if (error.statusCode === 404) {
      try {
        const newCart = await cartService.createCart(customerId);
        if (newCart && newCart.body) {
          const { id: cartId, version: cartVersion } = newCart.body;
          await cartService.updateCart(
            cartId,
            cartVersion,
            productId,
            quantity
            
          );
          res.status(200).json({ message: "Item added to cart" });
        } else {
          res.status(500).json({ error: "Failed to create new cart" });
        }
      } catch (creationError) {
        res.status(500).json({ error: "Failed to create new cart" });
      }
    } else {
      res
        .status(500)
        .json({ error: "Something went wrong while updating cart details" });
    }
  }
}

// check for existing cart 
async function checkCartExists(req, res) {
  const customerId = req.body.customerId;
  try {
    const cartData = await cartService.fetchCartDetails(customerId);
  } catch (error) {}
}

// Remove Line Item
const removeLineItem = async (req,res) => {
  try{
    const customerId = req.body.customerId
    const cartdetails = await cartService.fetchCartDetails(customerId);
    console.log("from remove item",cartdetails)
    const cartId = cartdetails.id;
    const cartVersion = cartdetails.version;
    const lineItemId = req.body.id;
    console.log("cartid",cartId)
    console.log("cartversion",cartVersion)
    console.log("lineItemId",lineItemId)
    const result = await cartService.removeLineItemService(cartId,cartVersion,lineItemId);
    res.status(200).json(result);

  } catch (error) {
    console.error("Error remove item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


// delete the cart
const deleteCartController = async (req, res) => {
  try {
    await deleteCart(storedCartId, storedCartVersion);
    res.status(200).json({ message: "Cart deleted successfully" });
    storedCartId = null;
    storedCartVersion = null;
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const shippingAddressController = async (req,res)=>{
  try{
    console.log("shipping body",req.body);  // Console log the request body
    const  address  = req.body;
    console.log("id",storedCartId,storedCartVersion)
    const result = await cartService.addShippingAddress(storedCartId, storedCartVersion,address);
    res.status(200).json(result);

  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


const orderController = async (req,res) =>{
  try{
    console.log("id",storedCartId,storedCartVersion)
    const result = await cartService.addOrder(storedCartId, storedCartVersion);
    res.status(200).json(result);

  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ error: "Internal server error" });
  }

}

module.exports = {
  getCartDetails,
  updateCartDetails,
  checkCartExists,
  deleteCartController,
  shippingAddressController,
  orderController,
  removeLineItem
};
