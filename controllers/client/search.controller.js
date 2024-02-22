const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;

  let products = [];

  if (keyword) {
    const keywordRegex = new RegExp(keyword, 'i');

    products = await Product.find({
      title: keywordRegex,
      status: 'active',
      deleted: false
    }).sort({ position: 'desc' })

    for (const item of products) {
      item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
    }
  }

  res.render('client/pages/search/index', {
    pageTitle: "Kết quả tìm kiếm",
    products: products,
    keyword: keyword
  })
} 