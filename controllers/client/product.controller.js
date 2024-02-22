const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

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

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const slugCategory = req.params.slugCategory;

    const category = await ProductCategory.findOne({
      slug: slugCategory,
      status: "active",
      deleted: false
    });

    const getSubCategory = async (parentId) => {
      const subs = await ProductCategory.find({
        parent_id: parentId,
        status: "active",
        deleted: false
      })

      let allSubs = [...subs];

      for (const sub of subs) {
        const child = await getSubCategory(sub.id);
        allSubs = allSubs.concat(child)
      }

      return allSubs;
    }

    const allCategory = await getSubCategory(category.id);

    const allCategoryId = allCategory.map(item => item.id);

    const products = await Product.find({
      product_category_id: {
        $in: [
          category.id,
          ...allCategoryId
        ]
      },
      status: "active",
      deleted: false
    });

    for (const item of products) {
      item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
    }

    res.render("client/pages/products/index", {
      pageTitle: "Danh sách sản phẩm",
      products: products
    });
  } catch (error) {
    res.redirect("/")
  }
}

// [GET] /products/:slugProduct
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slugProduct

    const product = await Product.findOne({
      slug: slug,
      deleted: false,
      status: "active"
    })

    product.priceNew = (product.price * (100 - product.discountPercentage) / 100).toFixed(0);

    if (product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
      })

      product.category = category
    }

    res.render('client/pages/products/detail', {
      pageTitle: product.title,
      product: product
    })
  } catch (error) {
    res.redirect("/")
  }
}
