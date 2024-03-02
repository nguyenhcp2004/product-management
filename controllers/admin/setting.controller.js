const SettingGeneral = require("../../models/settings-general.model")

//[GET] /admin/settings/general
module.exports.general = async (req, res) => {
  const settingsGeneral = await SettingGeneral.findOne({})

  res.render('admin/pages/settings/general', {
    pageTitle: "Cài đặt chung",
    settingsGeneral: settingsGeneral
  })
}

//[PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  const settingsGeneral = await SettingGeneral.findOne({})

  if (settingsGeneral) {
    await SettingGeneral.updateOne({
      _id: settingsGeneral._id
    }, req.body)

    req.flash('success', 'Cập nhật thành công')
  } else {
    const record = new SettingGeneral(req.body)
    await record.save()
    req.flash('error', 'Cập nhật không thành công')
  }
  res.redirect("back")
}