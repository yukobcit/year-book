const User = require("../models/User");
const UserOps = require("../data/UserOps");
const _userOps = new UserOps();
const passport = require("passport");
const RequestService = require("../services/RequestService");
const path = require("path");
const dataPath = path.join(__dirname, "../public/");
// const { isGeneratorFunction } = require("util/types");

exports.Index = async function (req, res) {
let students = []
let reqInfo = RequestService.reqHelper(req);
// search
if(req.query.searchStudents){
  students = await _userOps.searchStudents(req.query.searchStudents);
}
// no search
else{
  students = await _userOps.getAllStudents();
}
  if (students) {
    res.render("year-book/students", {
      title: "Year Book - Students ",
      students: students,
      reqInfo: reqInfo,
    });
  } else {
    res.render("year-book/students", {
      title: "Year Book - Students ",
      students: [],
      reqInfo: reqInfo,
    });
  }
};

exports.Detail = async function (req, res) {
let reqInfo = RequestService.reqHelper(req);
let roles = await _userOps.getRolesByUsername(reqInfo.username);
let sessionData = req.session;
sessionData.roles = roles;
reqInfo.roles = roles;
let pageStudentInfo ='';

// if is is not from login, check parameter for id
const id = req.params.id;
id ? pageStudentInfo = await _userOps.getStudentById(id) :  pageStudentInfo = await _userOps.getUserByUsername(reqInfo.username)

// get all the atudents for side bar
students = await _userOps.getAllStudents();

if (pageStudentInfo) {
  res.render("year-book/profile", {
    title: "Year Book - " + pageStudentInfo.user.firstName,
    student: pageStudentInfo,
    students: students,
    reqInfo: reqInfo,
    layout: "./layouts/side-bar",
  });
} else {
  res.render("year-book/profile", {
    title: "Year Book - Student",
    student: [],
    students: [],
    reqInfo: reqInfo,
    layout: "./layouts/side-bar",
  });
}
};

exports.Edit = async function (req, res) {
  const id = req.params.id;
  let reqInfo = RequestService.reqHelper(req);
  let pageStudentInfo = await _userOps.getStudentById(id);
  let pageStudentRoles = pageStudentInfo.user.roles;
  let userRoles = await _userOps.getRolesByUsername(reqInfo.username);
  let managerCheck = '';
  let adminCheck = '';
  pageStudentRoles.includes("Manager") ? managerCheck = "checked" : '';
  pageStudentRoles.includes("Admin") ? adminCheck = "checked" : '';

  if (reqInfo.id == id || userRoles.includes("Manager") || userRoles.includes("Admin")){
    res.render("year-book/student-form", {
      title: "Edit Student Info",
      errorMessage: "",
      // username: username,
      id : id,
      student: pageStudentInfo,
      reqInfo: reqInfo,
      managerCheck: managerCheck,
      adminCheck: adminCheck
    });
  }else{
    console.log("Error, not autherized to edit")
    let userInfo = await _userOps.getStudentById(id);
    students = await _userOps.getAllStudents();

    if (userInfo) {
      res.render("year-book/profile", {        
        title: "Year Book - Students",
        student: pageStudentInfo,
        students: students,
        reqInfo: reqInfo,
        id : id,
        layout: "./layouts/side-bar",
      });
    }
  }
}

exports.EditStudent = async function (req, res) {
  const id = req.body.student_id;
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  let manager = req.body.manager;
  let admin = req.body.admin;
  let photoDelete = req.body.photoDelete;
  let roles = [];
  let reqInfo = RequestService.reqHelper(req);
  let userInfo = await _userOps.getStudentById(id);

  if (manager != null){
    roles.push(manager);
  }
  if(admin != null){
    roles.push(admin);
  }

  let path = userInfo.user.imagePath;

  if(req.files != null)
  {
    path = dataPath+"/images/"+req.files.photo.name
    req.files.photo.mv(path) 
    path = "/images/"+req.files.photo.name
  }else if(photoDelete){
    console.log('delete');
    path = ''
  }
  let studentInterests = req.body.interests.split(",")
  let responseObj = await _userOps.updateStudentById(id, firstName,lastName,studentInterests,path,email,roles);

  if (responseObj.errorMsg == "") {
    let students = await _userOps.getAllStudents();

    res.render("year-book/profile", {
      title: "Year Book - Students",
      student: responseObj,
      students: students,
      reqInfo: reqInfo,
      username: responseObj.user.username,
      layout: "./layouts/side-bar",
    });
  }
  else {
    res.render("year-book/student-form", {
      title: "Edit Student Info",
      id : id,
      student: userInfo,
      reqInfo: reqInfo,
      username: responseObj.user.username,
      errorMessage: responseObj.errorMsg,
    });
  }
};

exports.DeleteStudentById = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  let roles = await _userOps.getRolesByUsername(reqInfo.username);
  let students = await _userOps.getAllStudents();
  // if it is not admin, not allowed to delete 
  if (!roles.includes("Admin")){

    if (students) {
      res.render("year-book/students", {
        title: "Year Book - Students",
        students: students,
        reqInfo: reqInfo,
      }
      );
    } else {
      res.render("year-book/students", {
        title: "Year Book - Students",
        students: [],
        reqInfo: reqInfo,
      })
    }
    return;
  }
  const studentId = req.params.id;
  let deletedStudent = await _userOps.deleteProfileById(studentId);
  students = await _userOps.getAllStudents();
    if (deletedStudent) {
      res.render("year-book/students", {
        title: "Year Book",
        students: students,
        reqInfo: reqInfo,
      });
    } else {
      res.render("year-book/students", {
        title: "Year Book",
        students: students,
        reqInfo: reqInfo,
        errorMessage: "Error.  Unable to Delete",
      });
    }
  };

exports.CommentStudent = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  const username = req.body.student_username;
  let authorInfo = await _userOps.getUserByUsername(reqInfo.username,);
  let students = await _userOps.getAllStudents();
  let student = await _userOps.getUserByUsername(username);

  console.log("Saving a comment for ", username);
  const comment = {
    commentBody: req.body.comment,
    commentAuthor: authorInfo.user.firstName
  };
  let responseObj = await _userOps.updateStudentCommentByUsername(
    comment,
    username
  );

  if (responseObj.errorMessage != "") {
      console.log("An error occured. Item not created.")
      }
  res.redirect("/year-book/" + student.user.id)
};

// // Admin Area available to users who belong to Admin role
// exports.AdminArea = async function (req, res) {
//   let reqInfo = RequestService.reqHelper(req, ["Admin"]);
//   if (reqInfo.rolePermitted) {
//     res.render("user/admin-area", { errorMessage: "", reqInfo: reqInfo });
//   } else {
//     res.redirect(
//       "/user/login?errorMessage=You must be an admin to access this area."
//     );
//   }
// };

// // Manager Area available to users who belong to Admin and/or Manager role
// exports.ManagerArea = async function (req, res) {
//   let reqInfo = RequestService.reqHelper(req, ["Admin", "Manager"]);
//   if (reqInfo.rolePermitted) {
//     res.render("user/manager-area", { errorMessage: "", reqInfo: reqInfo });
//   } else {
//     res.redirect(
//       "/user/login?errorMessage=You must be a manager or admin to access this area."
//     );
//   }
// };