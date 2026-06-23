const Product = require("../models/productModel");
const fs = require("fs");
const path = require("path");

/* PUBLIC */
exports.publicMenu = async (req, res) => {
  const products = await Product.getVisibleProducts();
  res.json(products);
};

/* ADMIN */
exports.adminMenu = async (req, res) => {
  const products = await Product.getAllProducts();
  res.json(products);
};

/* CREATE */
exports.create = async (req, res) => {
  const { name, price, category } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "invalid" });
  }

  const image = req.file ? req.file.filename : "";

  const id = await Product.createProduct({
    ...req.body,
    image
  });

  res.json({ id });
};

/* DELETE + CLEAN FILE */
exports.remove = async (req, res) => {
  const products = await Product.getAllProducts();
  const p = products.find(x => x.id == req.params.id);

  if (p?.image) {
    const filePath = path.join(__dirname, "../uploads", p.image);
    fs.unlink(filePath, () => {});
  }

  await Product.deleteProduct(req.params.id);

  res.json({ success: true });
};

/* TOGGLE */
exports.toggle = async (req, res) => {
  await Product.updateVisibility(
    req.params.id,
    req.body.visible
  );

  res.json({ success: true });
};

/* UPDATE + CLEAN OLD IMAGE */
exports.update = async (req, res) => {

  const products = await Product.getAllProducts();
  const old = products.find(x => x.id == req.params.id);

  let image = old.image;

  if (req.file) {

    if (old.image) {
      const oldPath = path.join(
        __dirname,
        "../uploads",
        old.image
      );

      fs.unlink(oldPath, () => {});
    }

    image = req.file.filename;
  }

  await Product.updateProduct(req.params.id, {
    ...req.body,
    image
  });

  res.json({ success: true });
};