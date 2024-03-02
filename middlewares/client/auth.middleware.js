const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.tokenUser) {
    res.redirect(`/user/login`);
    return;
  }

  try {
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      status: 'active',
      deleted: false,
    }).select("-password");

    if (!user) {
      res.redirect(`/user/login`);
      return;
    }

    res.locals.infoUser = user

    next();
  } catch (error) {
    res.redirect(`/user/login`);
  }
}