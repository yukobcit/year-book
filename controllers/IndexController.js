const RequestService = require("../services/RequestService");

exports.Index = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  return res.render("index", { reqInfo: reqInfo });
};
