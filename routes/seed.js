const mongoose = require('mongoose');
const fs = require('fs'); // To read the JSON file
const router = require('express').Router();
const Product = require('../models/product'); 
const Order = require('../models/order')


mongoose.connect('mongodb://localhost:27017/test_project', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



router.post('/seed_product', async (req, res) => {
  try {
    const jsonFilePath = './dummy/product.json'
    
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

    if (!jsonData.products || !Array.isArray(jsonData.products)) {
      return res.status(400).json({ error: 'JSON data structure is not as expected' });
    }

    const productsArray = jsonData.products;

  
    for (const productData of productsArray) {
      const product = new Product(productData);
      await product.save();
    }


    return res.status(201).json({ message: 'Data seeded successfully', jsonData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/seed_order', async (req, res) => {
  try {
    const jsonFilePath = './dummy/order.json'
    
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

    if (!jsonData.orders || !Array.isArray(jsonData.orders)) {
      return res.status(400).json({ error: 'JSON data structure is not as expected' });
    }

    
    const ordersArray = jsonData.orders;

    for (const orderData of ordersArray) {
      const order = new Order(orderData);
      await order.save();
    }


    return res.status(201).json({ message: 'Data seeded successfully', jsonData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;