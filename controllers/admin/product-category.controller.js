const Product = require("../../models/product.model");
const systemConfig = require('../../config/system');
const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/create-tree.helper");

// [GET] /admin/products-category/
module.exports.index = async (req, res) => {
  const records = await ProductCategory.find({
    deleted: false
  });

  res.render('admin/pages/products-category/index', {
    pageTitle: "Danh mục sản phẩm",
    records: records
  })
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  const records = await ProductCategory.find({
    deleted: false,
  })

  // console.log(records)
  const newRecords = createTreeHelper(records)

  // console.log(newRecords)

  res.render('admin/pages/products-category/create', {
    pageTitle: "Thêm mới danh mục sản phẩm",
    records: newRecords
  })
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (res.locals.role.permissions.includes("products-category_create")) {
    if (req.body.position == '') {
      const count = await ProductCategory.countDocuments();
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    req.flash("success", "Thêm mới danh mục sản phẩm thành công!");

    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);

  } else {
    res.send("403")
  }
}

//[PATCH] admin/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await ProductCategory.updateOne({
    _id: id
  }, {
    status: status
  })

  req.flash('success', 'Cập nhật trạng thái thành công!');
  res.redirect("back");
}

//[DELETE] admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
  if (res.locals.role.permissions.includes("products-category_delete")) {
    try {
      const id = req.params.id;
      console.log(req.params.id)

      await ProductCategory.updateOne({
        _id: id
      }, {
        deleted: true,
        deletedAt: new Date()
      })
      req.flash('success', 'Xóa sản phẩm thành công!');
    } catch (error) {
      console.log(error)
    }

    res.redirect("back");
  } else {
    res.send("403")
  }
}

//[GET] admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await ProductCategory.findOne({
      _id: id,
      deleted: false
    });

    res.render('admin/pages/products-category/detail', {
      pageTitle: "Trang chi tiết danh mục",
      category: category
    })
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
  }
}

//[GET] admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const data = await ProductCategory.findOne({
      _id: req.params.id,
      deleted: false
    });

    const record = await ProductCategory.find({
      deleted: false
    })

    const newRecords = createTreeHelper(record)
    res.render('admin/pages/products-category/edit', {
      pageTitle: "Trang chi tiết danh mục",
      data: data,
      records: newRecords
    })
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
  }
}

//[PATCH] admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  if (res.locals.role.permissions.includes("products-category_edit")) {
    try {
      if (req.body.position == "") {
        const countRecords = await ProductCategory.countDocuments();
        req.body.position = countRecords + 1;
      } else {
        req.body.position = parseInt(req.body.position);
      }

      await ProductCategory.updateOne({
        _id: req.params.id,
        deleted: false
      }, req.body);

      req.flash("success", "Cập nhật danh mục sản phẩm thành công!");

      res.redirect(`back`);
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    }
  } else {
    res.send("403")
  }
}



