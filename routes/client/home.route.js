const express = require('express');
const router = express.Router();

const controller = require('../../controllers/client/home.controller')

router.get('/', controller.index);

// router.get('/edit', (req, res) => {
//   res.send('Trang chi tiết sản phẩm')
// });

module.exports = router