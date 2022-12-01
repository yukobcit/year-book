const RequestService = require("../services/RequestService");

exports.Index = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  return res.render("index", { reqInfo: reqInfo, title: "Home"} );
};

// Handle profile form GET request
exports.Create = async function (request, response) {
  response.render("about", { title: "about" })
};

