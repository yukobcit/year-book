const RequestService = require("../services/RequestService");

exports.Index = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated) {
    return res.render("secure/secure-area", { reqInfo: reqInfo });
  } else {
    res.redirect(
      "/user/login?errorMessage=You must be logged in to view this page."
    );
  }
};
