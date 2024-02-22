const md5 = require("md5")
const Account = require("../../models/account.model")
const systemConfig = require('../../config/system');

//[GET] /admin/auth/login
module.exports.login = async (req, res) => {
  res.render("admin/pages/auth/login", {
    pageTitle: "Trang đăng nhập"
  })
}

//[POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const user = await Account.findOne({
    email: req.body.email,
    deleted: false
  })

  if (!user) {
    req.flash("error", "Email không tồn tại!")
    res.redirect("back");
    return;
  }

  if (user.password != md5(req.body.password)) {
    req.flash("error", "Sai mật khẩu!")
    res.redirect("back");
    return;
  }

  if (user.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!")
    res.redirect("back");
    return;
  }

  res.cookie("token", user.token)
  res.redirect(`/${systemConfig.prefixAdmin}/dashboard`)
}

//[GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("token")
  res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
}