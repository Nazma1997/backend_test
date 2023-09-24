const {Schema, model} = require("mongoose");

const productScheme =new Schema({
  product_id: Number,
  product_name: String,
  description: String,
  price: String,
});

const Product = model("Product", productScheme)
module.exports = Product;