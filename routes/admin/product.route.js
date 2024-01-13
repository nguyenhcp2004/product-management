const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const dotenv = require('dotenv');
dotenv.config();
// const storageMulter = require("../../helpers/storage-multer.helper");
// const upload = multer({ storage: storageMulter() });

//cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
//end cloudinary 
const upload = multer();

const controller = require('../../controllers/admin/product.controller')
const validate = require('../../validates/admin/product.validate')

router.get('/', controller.index);
router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);
router.delete('/delete/:id', controller.deleteItem);
router.get('/create', controller.create);
router.post(
  '/create',
  upload.single('thumbnail'),
  function (req, res, next) {
    if (req.file) {
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      async function upload(req) {
        let result = await streamUpload(req);
        req.body[req.file.fieldname] = result.url;
        next();
      }

      upload(req);
    } else {
      next();
    }
  },
  validate.createPost,
  controller.createPost);
router.get('/edit/:id', controller.edit);
router.patch(
  '/edit/:id',
  upload.single('thumbnail'),
  function (req, res, next) {
    if (req.file) {
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      async function upload(req) {
        let result = await streamUpload(req);
        req.body[req.file.fieldname] = result.url;
        next();
      }

      upload(req);
    } else {
      next();
    }
  },
  validate.createPost,
  controller.editPatch);
router.get('/detail/:id', controller.detail);

module.exports = router