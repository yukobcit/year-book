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
    res.render("students", {
      title: "Year Book - Students",
      students: students,
      reqInfo: reqInfo,
    });
  } else {
    res.render("students", {
      title: "Year Book - Students",
      profiles: [],
      reqInfo: reqInfo,
    });
  }
};


// Displays registration form.
exports.Register = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  res.render("user/register", { 
    errorMessage: "", 
    user: {}, 
    reqInfo: reqInfo,
    title: "Year Book - Register", });
};

// Handles 'POST' with registration form submission.
exports.RegisterUser = async function (req, res) {
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  if (password == passwordConfirm) {
    // Creates user object with mongoose model.
    // Note that the password is not present.
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
    });

    // Uses passport to register the user.
    // Pass in user object without password
    // and password as next parameter.
    User.register(
      new User(newUser),
      req.body.password,
      function (err, account) {
        // Show registration form with errors if fail.
        if (err) {
          let reqInfo = RequestService.reqHelper(req);
          return res.render("user/register", {
            user: newUser,
            errorMessage: err,
            reqInfo: reqInfo,
            title: "Year Book - Register"
          });
        }
        // User registered so authenticate and redirect to secure
        // area.
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secure/secure-area");
        });
      }
    );
  } else {
    let reqInfo = RequestService.reqHelper(req);
    res.render("user/register", {
      user: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        title: "Year Book - Register"
      },
      errorMessage: "Passwords do not match.",
      reqInfo: reqInfo,
    });
  }
};

exports.Logout = (req, res) => {
  // Use Passports logout function
  req.logout((err) => {
    if (err) {
      console.log("logout error");
      return next(err);
    } else {
      // logged out.  Update the reqInfo and redirect to the login page
      let reqInfo = RequestService.reqHelper(req);
      res.render("user/login", {
        user: {},
        isLoggedIn: false,
        errorMessage: "",
        reqInfo: reqInfo,
        title: "Year Book - Log out"
      });
    }
  });
};

// Shows login form.
exports.Login = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  let errorMessage = req.query.errorMessage;
  res.render("user/login", {
    user: {},
    errorMessage: errorMessage,
    reqInfo: reqInfo,
    title: "Year Book - Log in"
  });
};


// Receives login information & redirects
// depending on pass or fail.

exports.LoginUser = async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/login?errorMessage=Invalid login.",
  })(req, res, next);
};


// exports.LoginUser = (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/secure/secure-area",
//     failureRedirect: "/user/login?errorMessage=Invalid login.",
//   })(req, res, next);
// };

exports.Profile = async function (req, res) {

  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated) {
    let roles = await _userOps.getRolesByUsername(reqInfo.username);
    let sessionData = req.session;
    sessionData.roles = roles;
    reqInfo.roles = roles;
    let userInfo = await _userOps.getUserByUsername(reqInfo.username);

    // get user by....
    students = await _userOps.getAllStudents();
    // console.log(students)
    if (userInfo) {
      res.render("profile", {
        title: "Year Book - Students",
        student: userInfo,
        students: students,
        reqInfo: reqInfo,


        layout: "./layouts/side-bar",
      });
    } else {
      res.render("profile", {
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
  const username = req.params.id;
  console.log("username"+ username)
  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated) {

    let userInfo = await _userOps.getUserByUsername(username);
    console.log(userInfo)

    // get user by....
    students = await _userOps.getAllStudents();

    if (userInfo) {
      res.render("profile", {
        title: "Year Book - Students",
        student: userInfo,
        students: students,
        reqInfo: reqInfo,
        layout: "./layouts/side-bar",
      });
    } else {
      res.render("profile", {
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
  const username = req.params.id;
  let reqInfo = RequestService.reqHelper(req);
  let studentObj = await _userOps.getUserByUsername(username);
  res.render("student-form", {
    title: "Edit Student Info",
    errorMessage: "",
    username: username,
    student: studentObj,
    reqInfo: reqInfo,
  });
  console.log(studentObj)
};

exports.EditStudent = async function (req, res) {
  const username = req.body.student_username;
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  let reqInfo = RequestService.reqHelper(req);
  console.log(req.body)

  let path = "";

  if(req.files != null)
  {
    path = dataPath+"/images/"+req.files.photo.name
    req.files.photo.mv(path) 
    path = "/images/"+req.files.photo.name
  }
  let studentInterests = req.body.interests.split(",")
  let responseObj = await _userOps.updateStudentByUsername(username, firstName,lastName,studentInterests,path);

  if (responseObj.errorMsg == "") {
    let students = await _userOps.getAllStudents();
    console.log(responseObj.obj)
    res.render("profile", {
      title: "Express Yourself - " + responseObj.user.firstname,
      students: students,
      student: responseObj,
      username: responseObj.user.username,
      layout: "./layouts/side-bar",
      reqInfo: reqInfo,
    });
  }


  else {
    console.log("An error occured. Item not created.");
    response.render("profile-form", {
      title: "Edit Profile",
      profile: responseObj.obj,
      profileId: profileId,
      errorMessage: responseObj.errorMsg,
    });
  }
};