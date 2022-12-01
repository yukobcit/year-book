const User = require("../models/User");

class UserOps {
  // Constructor
  UserOps() {}

  async getUserByEmail(email) {
    let user = await User.findOne({ email: email });
    if (user) {
      const response = { obj: user, errorMessage: "" };
      return response;
    } else {
      return null;
    }
  }

  async getUserByUsername(username) {
    let user = await User.findOne({ username: username });
    if (user) {
      const response = { obj: user, errorMessage: "" };
      return response;
    } else {
      return null;
    }
  }
}

module.exports = UserOps;
