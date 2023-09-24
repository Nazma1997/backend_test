const {Schema, model} = require("mongoose");

const orderSchema =new Schema({
  order_id: String,
  customer_name: String,
  order_date: String,
  order_status: String,
  quantity: Number,
  total_amount: Number,
  product: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "Product" },
      product_name: String,
      product_id: Number,
    }
  ]
});

const Review = model("Order", orderSchema)
module.exports = Review;