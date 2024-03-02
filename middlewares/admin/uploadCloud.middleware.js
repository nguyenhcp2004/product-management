const uploadToClouddinary = require("../../helpers/upload-to-cloudinary.helper")

module.exports.uploadSingle = async (req, res, next) => {
  if (req.file) {
    const result = await uploadToClouddinary(req.file.buffer)
    req.body[req.file.fieldname] = result;
  }
  next();
}