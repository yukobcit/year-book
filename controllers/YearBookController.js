const User = require("../models/User");
const UserOps = require("../data/UserOps");
const passport = require("passport");
const RequestService = require("../services/RequestService");
const _userOps = new UserOps();
const path = require("path");
const dataPath = path.join(__dirname, "../public/");

exports.Index = async function (req, res) {
  console.log("loading students from controller");
let students = []
let reqInfo = RequestService.reqHelper(req);
if(req.query.searchStudents){
  students = await _userOps.searchStudents(req.query.searchStudents);
}
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

exports.Profile = async function (req, res) {

  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated) {
    let roles = await _userOps.getRolesByUsername(reqInfo.username);
    let sessionData = req.session;
    sessionData.roles = roles;
    reqInfo.roles = roles;
    
    // let userInfo = await _userOps.getUserByUsername(reqInfo.username);
    let userInfo = await _userOps.getStudentById(reqInfo.id);
    // get user by....
    students = await _userOps.getAllStudents();
    // console.log(students)
    if (userInfo) {
      res.render("year-book/profile", {
        title: "Year Book - " + userInfo.user.firstName,
        student: userInfo,
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
  } else {
    res.redirect(
      "/user/login?errorMessage=You must be logged in to view this page."
    );
  }
};


// Admin Area available to users who belong to Admin role
exports.AdminArea = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req, ["Admin"]);
  if (reqInfo.rolePermitted) {
    res.render("user/admin-area", { errorMessage: "", reqInfo: reqInfo });
  } else {
    res.redirect(
      "/user/login?errorMessage=You must be an admin to access this area."
    );
  }
};

// Manager Area available to users who belong to Admin and/or Manager role
exports.ManagerArea = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req, ["Admin", "Manager"]);
  if (reqInfo.rolePermitted) {
    res.render("user/manager-area", { errorMessage: "", reqInfo: reqInfo });
  } else {
    res.redirect(
      "/user/login?errorMessage=You must be a manager or admin to access this area."
    );
  }
};

exports.Detail = async function (req, res) {
  const id = req.params.id;
  console.log("year-book/username"+ id)
  let reqInfo = RequestService.reqHelper(req);

  if (reqInfo.authenticated) {

    // let userInfo = await _userOps.getUserByUsername(username);
    let userInfo = await _userOps.getStudentById(id);
    // get user by...
    students = await _userOps.getAllStudents();

    if (userInfo) {
      res.render("year-book/profile", {        
        title: "Year Book - " + userInfo.user.firstName,
        student: userInfo,
        students: students,
        reqInfo: reqInfo,
        username: userInfo.username,
        layout: "./layouts/side-bar",
      });
    } else {
      res.render("year-book/profile", {
        title: "Year Book - Students",
        student: [],
        students: [],
        reqInfo: reqInfo,

        layout: "./layouts/side-bar",
      });
    }
  } else {
    res.redirect(
      "/user/login?errorMessage=You must be logged in to view this page."
    );
  }
};

exports.Edit = async function (req, res) {
  const id = req.params.id;
  let reqInfo = RequestService.reqHelper(req);
  let userInfo = await _userOps.getStudentById(id);
  let roles = await _userOps.getRolesByUsername(reqInfo.username);
  let managerCheck = '';
  let adminCheck = '';

  if( userInfo.user.roles.includes("Manager")) {
    managerCheck = "checked";
  }
  if( userInfo.user.roles.includes("Admin")) {
    adminCheck = "checked";
  }

  if (reqInfo.id == id || roles.includes("Manager") || roles.includes("Admin")){
    res.render("year-book/student-form", {
      title: "Edit Student Info",
      errorMessage: "",
      // username: username,
      id : id,
      student: userInfo,
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
        student: userInfo,
        students: students,
        reqInfo: reqInfo,
        // username: username,
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
  const roles = [req.body.manager,req.body.admin];
  let reqInfo = RequestService.reqHelper(req);


  let path = "";
  console.log("req")


  if(req.files != null)
  {
    path = dataPath+"/images/"+req.files.photo.name
    req.files.photo.mv(path) 
    path = "/images/"+req.files.photo.name
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
    response.render("year-book/student-form", {
      title: "Edit Student Info",
      student: studentObj,
      students: students,
      username: responseObj.user.username,
      errorMessage: responseObj.errorMsg,
    });
  }
};
exports.DeleteStudentById = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  let roles = await _userOps.getRolesByUsername(reqInfo.username);
  if (roles.includes("Admin")){

  const studentId = req.params.id;
  let deletedStudent = await _userOps.deleteProfileById(studentId);
  let students = await _userOps.getAllStudents();

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
}else{
  students = await _userOps.getAllStudents();

  if (students) {
    res.render("year-book/students", {
      title: "Year Book - Students",
      students: students,
      reqInfo: reqInfo,
    });
  } else {
    res.render("students", {
      title: "Year Book - Students",
      students: [],
      reqInfo: reqInfo,
    })
   }
  }
};
exports.CommentStudent = async function (req, res) {
  
  let reqInfo = RequestService.reqHelper(req);
  const username = req.body.student_username;
  let authorInfo = await _userOps.getUserByUsername(reqInfo.username,);

  console.log("Saving a comment for ", username);
  const comment = {
    commentBody: req.body.comment,
    commentAuthor: authorInfo.user.firstName
  };
  let responseObj = await _userOps.updateStudentCommentByUsername(
    comment,
    username
  );

  if (responseObj.errorMessage == "") {
      res.render("year-book/profile", {
          title: "Year Book  -  " + responseObj.user.firstName,
          students: students,
          student: responseObj,
          username: responseObj.user.username,
          
          reqInfo: reqInfo,
          layout: "./layouts/side-bar",
        });
      }
  else{
      console.log("An error occured. Item not created.");
      res.render("year-book/student-form", {
        title: "Year Book  -  " + responseObj.user.firstName,
        students: students,
        student: responseObj,
        username: responseObj.user.username,
        errorMessage: responseObj.errorMsg,
      })
    }
};