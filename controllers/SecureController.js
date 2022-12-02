const User = require("../models/User");
const UserOps = require("../data/UserOps");
const passport = require("passport");
const RequestService = require("../services/RequestService");
const _userOps = new UserOps();


exports.Index = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated) {
    return res.render("secure/secure-area", { 
      reqInfo: reqInfo,
      title: "Year Book - Secure" });
  } else {
    res.redirect(
      "/user/login?errorMessage=You must be logged in to view this page."
    );
  }
};


exports.Index = async function (req, res) {
  console.log("loading students from controller");
let students = []
let reqInfo = RequestService.reqHelper(req);

if (reqInfo.authenticated) {

if(req.query.searchStudents){
  students = await _userOps.searchStudents(req.query.searchStudents);
}
else{
  students = await _userOps.getAllStudents();
}
  if (students) {
    res.render("secure/secure-area", {
      title: "Year Book - Students",
      students: students,
      reqInfo: reqInfo,
    });
  } else {
    res.render("secure/secure-area", {
      title: "Year Book - Students",
      profiles: [],
      reqInfo: reqInfo,
    });
  }
}  else {
  res.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
};

}
