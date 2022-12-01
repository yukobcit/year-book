const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const path = require("path");
const bodyParser = require("body-parser");

const passport = require("passport");
const LocalStrategy = require("passport-local");

// Database Setup
/* Make sure to update this to use your cluster, database, user, and password */
const mongoose = require("mongoose");
const uri =
"mongodb+srv://demo:ln1g5H7vreaITTJw@ssd-0.ljgfxff.mongodb.net/year-book?retryWrites=true&w=majority"
// Set up default mongoose connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// Store a reference to the default connection
const db = mongoose.connection;
// Log once we have a connection to Atlas
db.once("open", function () {
  console.log("Connected to Mongo");
});
// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Set up our server
const app = express();

// Parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set up session management
app.use(
  require("express-session")({
    secret: "a long time ago in a galaxy far far away",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport and configure for User model
app.use(passport.initialize());
app.use(passport.session());
const User = require("./models/User");
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up EJS templating
app.set("view engine", "ejs");
// Enable layouts
app.use(expressLayouts);
// Set the default layout
app.set("layout", "./layouts/main-layout");

// Make views folder globally accessible
app.set("views", path.join(__dirname, "views"));

// Make the public folder accessible for serving static files
app.use(express.static("public"));

// Index routes
const indexRouter = require("./routers/indexRouter");
app.use(indexRouter);

// User routes
const userRouter = require("./routers/userRouter");
app.use("/user", userRouter);

// Secure routes
const secureRouter = require("./routers/secureRouter");
app.use("/secure", secureRouter);

// Start listening
const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`Auth Demo listening on port ${port}!`));
