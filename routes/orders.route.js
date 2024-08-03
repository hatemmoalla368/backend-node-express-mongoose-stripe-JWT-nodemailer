var express = require('express');
var router = express.Router();

const Order = require('../models/Order');

const {authorizeRoles} = require("../middleware/authorizeRoles")
const {verifyToken} = require('../middleware/verifytoken')

//router.use(verifyToken);






/*router.get('/', authorizeRoles("admin", "superadmin"), async (req, res) => {
    try {
      const orders = await Order.find().populate('user items.product'); // Populate user and product details
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch orders', error });
    }
  });*/
  /*router.get('/myorders',verifyToken, async (req, res) => {
    try {
      const userId = req.user.id; // Assuming the user ID is stored in req.user.id
      console.log('Fetching orders for user:', userId);
      const orders = await Order.find({ user: userId }).populate('items.product');
      console.log('Orders fetched:', orders);
      res.json({ status: "success", data: orders });
    } catch (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ status: "error", message: err.message });
    }
  });*/

  router.get('/myorders/:userId', async (req, res) => {
    try {
      const userId = req.params.userId; // Retrieve the user ID from the URL parameters
      console.log('Fetching orders for user:', userId);
      const orders = await Order.find({ user: userId }).populate('items.product');
      console.log('Orders fetched:', orders);
      res.json({ status: 'success', data: orders });
    } catch (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ status: 'error', message: err.message });
    }
  });
  router.get('/',verifyToken,authorizeRoles("admin", "superadmin"),  async (req, res) => {
    try {
      const orders = await Order.find()
      .populate('user', 'firstname lastname email') // Adjust fields as necessary
        .populate('items.product', 'designation price imageart'); // Populate product details if needed
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get('/:id',verifyToken,authorizeRoles("admin", "superadmin"), async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate('user', 'firstname lastname email') // Populate user details if needed
        .populate('items.product', 'designation price imageart'); // Populate product details if needed
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.delete('/:id',verifyToken,authorizeRoles("admin", "superadmin"), async (req, res) => {
    try {
      const orderId = req.params.id;
      const deletedOrder = await Order.findByIdAndDelete(orderId);
      if (!deletedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  


  module.exports = router;