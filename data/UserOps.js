const User = require("../models/User");

class UserOps {
  // Constructor
  UserOps() {}

  async getAllStudents() {
    console.log("getting all students");
    let students = await User.find().sort({ name: 1 });
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
    let user = await User.findOne(
      { username: username },
      { _id: 0, username: 1, email: 1, firstName: 1, lastName: 1 }
    );
    if (user) {
      const response = { user: user, errorMessage: "" };
      return response;
    } else {
      return null;
    }
  }

//   async getUserByUsername(username) {
//     let user = await User.findOne({ username: username });
//     if (user) {
//       const response = { obj: user, errorMessage: "" };
//       return response;
//     } else {
//       return null;
//     }
//   }
async getRolesByUsername(username) {
  let user = await User.findOne({ username: username }, { _id: 0, roles: 1 });
  if (user.roles) {
    return user.roles;
  } else {
    return [];
  }
}
async updateStudentByUsername(username, firstName, lastName, studentInterests,path) {
 
  const student = await User.findByUsername(username);

  student.firstName = firstName;
  student.lastName = lastName;
  student.interests = studentInterests;
  student.imagePath = path;

  let result = await student.save();
  console.log("updated student: ", result);
  return {
    user: result,
    errorMsg: "",
  };
}



 }

module.exports = UserOps;
