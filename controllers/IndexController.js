const RequestService = require("../services/RequestService");
const passport = require("passport");
const User = require("../models/User");
const path = require("path");
const dataPath = path.join(__dirname, "../public/");

exports.Index = async function (req, res) {
  console.log("Index-controller")
  let reqInfo = RequestService.reqHelper(req);
  res.render("index", { reqInfo: reqInfo, title: "Home"} );
};

// Displays registration form.
exports.Register = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  res.render("register", { 
    errorMessage: "", 
    user: {}, 
    reqInfo: reqInfo,
    title: "Register", });
};

// Handles 'POST' with registration form submission.
exports.RegisterUser = async function (req, res) {
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  console.log(req.body)
  let path = "";
  if(req.files != null)
  {
    path = dataPath+"/images/"+req.files.photo.name
    req.files.photo.mv(path) 
    path = "/images/"+req.files.photo.name
  }
  let studentInterests = req.body.interests.split(",")

  if (password == passwordConfirm) {
    // Creates user object with mongoose model.
    // Note that the password is not present.
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      interests: studentInterests,
      imagePath: path
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
          return res.render("register", {
            user: newUser,
            errorMessage: err,
            reqInfo: reqInfo,
            title: "Register"
          });
        }
        // User registered so authenticate and redirect to secure
        // area.
        passport.authenticate("local")(req, res, function () {
          res.redirect("/year-book/detail");
        });
      }
    );
  } else {
    let reqInfo = RequestService.reqHelper(req);
    res.render("register", {
      user: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
      },
      errorMessage: "Passwords does not match.",
      reqInfo: reqInfo,
      title: "Register"
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
      res.render("login", {
        user: {},
        isLoggedIn: false,
        errorMessage: "",
        reqInfo: reqInfo,
        title: "Logout"
      });
    }
  });
};

// Shows login form.
exports.Login = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  let errorMessage = req.query.errorMessage;
  res.render("login", {
    user: {},
    errorMessage: errorMessage,
    reqInfo: reqInfo,
    title: "Login"
  });
};

// Receives login information & redirects
// depending on pass or fail.

exports.LoginUser = async (req, res, next) => {

  passport.authenticate("local", {
    successRedirect: "/year-book/detail",
    failureRedirect: "/login?errorMessage=Invalid login.",
  })(req, res, next);
};


