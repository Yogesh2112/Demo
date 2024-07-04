const client = require("../middleware/commercetools");

// fetching carts by customerId -complete
async function fetchCartDetails(customerId) {
  // console.log("customer-id",customerId)
  try {
    const response = await client.execute({
      method: "GET",
      uri: `/handicraft/carts/customer-id=${customerId}`,
    });
    // console.log("cart detail", response);
    return response.body;
  } catch (error) {
    // console.error("Error fetching customers cart details:", error);
    throw error.body;
  }
}

// updating line items in customer carts- not complete
async function updateCart(cartId, cartVersion, productId, quantity) {
  try {
    const response = await client.execute({
      method: "POST",
      uri: `/handicraft/carts/${cartId}`,
      body: {
        version: cartVersion,
        actions: [{
          action: "addLineItem",
          productId: productId,
          variantId: 1,
          quantity: quantity
        }]
      }
    });
    // console.log("service response from update cart", response);
    return response;
  } catch (error) {
    console.error("Cart Error:", error);
    throw error
  }
}

// create cart
async function createCart(customerId) {
  try {
    const newCart = await client.execute({
      method: "POST",
      uri: "/handicraft/carts",
      body: {
        currency: "INR",
        customerId,
      },
    });
    // console.log("new cart updated", newCart.body);
    return newCart;
  } catch (error) {
    console.log(error);
  }
}



// delete cart
async function deleteCart(cartId, cartVersion) {
  try {
    // console.log("delete cart",cartId,cartVersion)
    const response = await client.execute({
      method: "DELETE",
      uri: `/handicraft/carts/${cartId}?version=${cartVersion}`,
    });
    return response;
  } catch (error) {
    console.error("Error deleting cart:", error);
    throw error;
  }
}
// add shipping address
async function addShippingAddress(cartId, cartVersion, address) {
  try {
    // console.log("data on address", cartId, cartVersion, address)
    const addressPayload = {
      title: address.title,
      firstName: address.firstName,
      lastName: address.lastName,
      streetName: address.address,
      postalCode: address.zipcode,
      city: address.city,
      state: address.state,
      country: address.country,

    };
    const response = await client.execute({
      method: "POST",
      uri: `/handicraft/carts/${cartId}`,
      body: {
        version: cartVersion,
        actions: [
          {
            action: "setShippingAddress",
            address: addressPayload
          }
        ]
      },
    });
    // console.log("hello shipping",response)
    return response;
  } catch (error) {
    console.error("Error in adding shipping address:", error);
    throw error;
  }
}

// add order
async function addOrder(cartId, cartVersion) {
  try {
    // console.log("order manage", cartId, cartVersion)
    
    const response = await client.execute({
      method: "POST",
      uri: `/handicraft/orders`,
      body: {
        cart : {
          id : cartId,
          typeId : "cart"
        },
        version : cartVersion
      },
    });
    return response;
  } catch (error) {
    console.error("Error in order:", error);
    throw error;
  }
}
// add order
async function removeLineItemService(cartId, cartVersion,lineItemId) {
  try {
    // console.log("order manage", cartId, cartVersion)
    
    const response = await client.execute({
      method: "POST",
      uri: `/handicraft/carts/${cartId}`,
      body:{
        version: cartVersion,
        actions: [
            {
                action : "removeLineItem",
                lineItemId :lineItemId,
                
                
              }
        ]
    },
    });
    return response;
  } catch (error) {
    console.error("Error in order:", error);
    throw error;
  }
}


module.exports = {
  fetchCartDetails,
  updateCart,
  createCart,
  deleteCart,
  addShippingAddress,
  addOrder,
  removeLineItemService
};
