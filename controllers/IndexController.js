const RequestService = require("../services/RequestService");

exports.Index = async function (req, res) {
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
  res.render("cotact", { 
    reqInfo: reqInfo,  
    title: "contact",
    status: null })
};

