const Product =
require("../models/productModel");

exports.publicMenu = async (
 req,
 res
)=>{

 const products =
  await Product.getVisibleProducts();

 res.json(products);

};

exports.adminMenu = async (
 req,
 res
)=>{

 const products =
  await Product.getAllProducts();

 res.json(products);

};

exports.create = async (
 req,
 res
)=>{

 const image =
 req.file
 ? req.file.filename
 : "";

 const id =
 await Product.createProduct({

  ...req.body,

  image

 });

 res.json({
  id
 });

};

exports.remove = async (
 req,
 res
)=>{

 await Product.deleteProduct(
  req.params.id
 );

 res.json({
  success:true
 });

};

exports.toggle = async (
 req,
 res
)=>{

 await Product.updateVisibility(
  req.params.id,
  req.body.visible
 );

 res.json({
  success:true
 });

};