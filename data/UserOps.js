const User = require("../models/User");

class UserOps {
  // Constructor
  UserOps() {}

  async getAllStudents() {
    console.log("getting all students");
    let students = await Students.find().sort({ name: 1 });
    return students;
  }

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
