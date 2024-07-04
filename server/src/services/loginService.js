const client = require("../middleware/commercetools");

// authorise customers from commercetools
async function authorizeLogin(email,password) {
  try {
    const response = await client.execute({
      method: "POST",
      uri: "/handicraft/login",
      body :{email,password}
    });
    // console.log(response.body.customer.id)
    return response.body.customer.id;
  } catch (error) {
    console.error("Invalid Credentials:", error);
    return false
  }
}

module.exports = {
  authorizeLogin,
};
