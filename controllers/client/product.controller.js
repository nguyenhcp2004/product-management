const Product = require("../../models/product.model");

// [GET] /products/
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: 'active',
    deleted: false
  }).sort({
    position: 'desc'
  });

  for (const item of products) {
    item.priceNew = item.price * (1 - item.discountPercentage / 100);
    item.priceNew = item.priceNew.toFixed(0);
  }
  res.render('client/pages/products/index', {
    pageTitle: 'Trang danh sách sản phẩm',
    products: products
  });
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug

    const product = await Product.findOne({
      slug: slug,
      deleted: false,
      status: "active"
    })

    res.render('client/pages/products/detail', {
      pageTitle: product.title,
      product: product
    })
  } catch (error) {
    res.redirect("/")
  }
}
