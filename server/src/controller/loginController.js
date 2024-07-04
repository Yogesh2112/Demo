const loginService = require("../services/loginService");

// login Controller
async function authenticateUser(req, res) {
  const { email, password } = req.body;
  // console.log("email and password",req.body);
  try {
    const loginResult = await loginService.authorizeLogin(email, password);
    if (loginResult) {
      res.status(200).json({ message: "Login success",customerId:loginResult });
    } else {
      res.status(401).json({ error: "Login failed - Invalid Credentials" });
    }
  } catch (error) {
    // console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred" });
  }
}

module.exports = {
  authenticateUser,
};
