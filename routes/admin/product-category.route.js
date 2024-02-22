const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware')
const validate = require('../../validates/admin/product-category.validate')

const controller = require('../../controllers/admin/product-category.controller')

router.get('/', controller.index);
router.get('/create', controller.create);
router.post(
  '/create',
  upload.single('thumbnail'),
  uploadCloud.uploadSingle,
  validate.createPost,
  controller.createPost);
router.patch('/change-status/:status/:id', controller.changeStatus);
router.delete('/delete/:id', controller.deleteItem);
router.get('/detail/:id', controller.detail);
router.get('/edit/:id', controller.edit);
router.patch(
  '/edit/:id',
  upload.single("thumbnail"),
  uploadCloud.uploadSingle,
  validate.createPost,
  controller.editPatch);

module.exports = router