const RequestService = require("../services/RequestService");
const passport = require("passport");

exports.Index = async function (req, res) {
  console.log("Index-controller")
  let reqInfo = RequestService.reqHelper(req);
  res.render("index", { reqInfo: reqInfo, title: "Home"} );
};

// Handle profile form GET request
exports.About = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  res.render("about", { reqInfo: reqInfo,  title: "about" })
};

exports.Contact = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  res.render("contact", { 
    reqInfo: reqInfo,  
    title: "contact",
    status: null })
};

// Displays registration form.
exports.Register = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  res.render("register", { 
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
          res.redirect("/user");
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
        title: "Year Book - Register "
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
      res.render("login", {
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
  res.render("login", {
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
    successRedirect: "/year-book/profile",
    failureRedirect: "/login?errorMessage=Invalid login.",
  })(req, res, next);
};


