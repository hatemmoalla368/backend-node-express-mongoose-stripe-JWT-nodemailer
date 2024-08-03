const express=require('express');
const Order = require('../models/Order'); // Import the Order model
const {verifyToken} =require("../middleware/verifytoken")


const router = express.Router();
const stripe = require ('stripe');
const Stripe =
stripe('sk_test_51OLA2mAr5IduUJmeJhKbaHhdcUgME2LTNyyi7mGeEGxqVl5XePEYonWp2tz6RXIwEY35LrTNsDWedK0vW8pms46K00siisF8Ot');
router.post('/',verifyToken, async (req, res) => { console.log(req.body)
  let status, error;
  const { token, amount, userId, cartItems } = req.body;
  try {
    let parsedCartItems = cartItems;

    // Check if cartItems is a string and parse it
    if (typeof cartItems === 'string') {
      try {
        // Parse the first level of encoding
        parsedCartItems = JSON.parse(cartItems);

        // If parsedCartItems is still a string (double-encoded), parse it again
        if (typeof parsedCartItems === 'string') {
          parsedCartItems = JSON.parse(parsedCartItems);
        }
      } catch (parseError) {
        console.error('Error parsing cartItems:', parseError);
      }
    }

    // Check if parsedCartItems is an array
    if (!Array.isArray(parsedCartItems)) {
      console.error('cartItems is not an array');
    }

    

    await Stripe.charges.create({
      source: token.id,
      amount,
      currency: 'usd',
    });
    
 // Create a new order
 const newOrder = new Order({
  user: userId,
  
     items: parsedCartItems.map(item => ({
      photo : item.imageart,
              product: item._id,
              quantity: item.cartQuantity,
              price: item.prix
          })),

  totalAmount: amount / 100, // Stripe amount is in cents
  status: 'completed'
});
console.log('New order details:', newOrder);


await newOrder.save();

    status = 'success';
  } catch (error) {
    console.log(error);
    status = 'Failure';
  }
  res.json({ error, status });
});

module.exports = router;