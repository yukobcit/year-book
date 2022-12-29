const User = require("../models/User");

class UserOps {
  // Constructor
  UserOps() {}

  async getAllStudents() {
    console.log("getting all students");
    let students = await User.find().sort({ lastName: 1 });
    return students;
  }

  async getUserByUsername(username) {
    let user = await User.findOne(
      { username: username },
      { _id: 1, username: 1, email: 1, firstName: 1, lastName: 1, interests: 1, imagePath: 1, comments: 1, roles: 1 }
    );
    if (user) {
      const response = { user: user, errorMessage: "" };
      return response;
    } else {
      return null;
    }
  }

  async getStudentById(id) {
    let user = await User.findOne(
      { _id: id },
      { _id: 1, username: 1, email: 1, firstName: 1, lastName: 1, interests: 1, imagePath: 1, comments: 1, roles: 1 }
    );
    if (user) {
      const response = { user: user, errorMessage: "" };
      return response;
    } else {
      return null;
    }
  }


async getRolesByUsername(username) {
  let user = await User.findOne({ username: username }, { _id: 0, roles: 1 });
  if (user.roles) {
    return user.roles;
  } else {
    return [];
  }
}
async updateStudentById(id, firstName, lastName, studentInterests,path,email,roles) {
 
  const student = await User.findById(id);

  student.firstName = firstName;
  student.lastName = lastName;
  student.interests = studentInterests;
  student.imagePath = path;
  student.email = email;
  student.roles = roles;

  let result = await student.save();
  console.log("updated student: ", result);
  return {
    user: result,
    errorMsg: "",
  };
}

async updateStudentCommentByUsername(comment, username) {
  let user = await User.findOne({ username: username });

  user.comments.push(comment);
  try {
    let result = await user.save();
    console.log("updated user: ", result);
    const response = { user: result, errorMessage: "" };
    return response;
  } catch (error) {
    console.log("error saving user: ", result);
    const response = { user: user, errorMessage: error };
    return response;
  }
}
async searchStudents(string) {
  const firstNameFilter = {firstName: {$regex: string, $options: "i"}};
  const lastNameFilter = {lastName: {$regex: string, $options: "i"}};
  let students = await User.find({$or: [firstNameFilter,lastNameFilter]}).sort({ lastName: 1 });
  return students;
}

  async deleteProfileById(id) {
  console.log(`deleting student by id`);
  let result = await User.findByIdAndDelete(id);
  console.log(result);
  return result;
}
}
module.exports = UserOps;
