// models/Order.js
const mongoose = require('mongoose');
const user =require("./user");
const article =require("./article");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  items: [
    {
      photo : { type: String, required: false },
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'article', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'shipped', 'cancelled'], default: 'pending' },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});


module.exports = mongoose.model('Order', orderSchema);
