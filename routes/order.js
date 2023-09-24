const router = require('express').Router();
const Order = require('../models/order');



router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.find().populate('product');
    return res.status(200).json(orders)
  } catch (error) {
    next(error)
  }
})

router.get('/search_orders', async (req, res) => {
  try {
   
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const queryConditions = {};

    // Handle search parameter (e.g., by customer_name)
    if (req.query.customer_name) {
      queryConditions.customer_name = { $regex: req.query.customer_name, $options: 'i' };
    }

    // Handle search parameter (e.g., by order ID)
    if (req.query.order_id) {
      queryConditions.order_id = { $regex: req.query.order_id, $options: 'i' };
    }
    // Handle search parameter (e.g., by product Name)
    // Handle search parameter by product_name
    if (req.query.product_name) {
      queryConditions['product.product_name'] = { $regex: req.query.product_name, $options: 'i' };
    }

   

    let query = Order.find();

    // Apply the query conditions if any search parameters are provided
    if (Object.keys(queryConditions).length > 0) {
      query = query.find(queryConditions);
    }

    // Execute the database query with pagination and sorting
    const orders = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ order_date: 1 }); // Sort by order_date in descending order

    // Get the total count for pagination
    const totalCount = await Order.countDocuments(queryConditions);

    return res.status(200).json({
      orders,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.get('/filter_orders', async (req, res) => {
  try {
    const filters = req.query;

    let query = Order.find();

    // Apply filters 
    if (filters.order_status) {
      const statusFilter = Array.isArray(filters.order_status)
        ? filters.order_status
        : [filters.order_status];
      query = query.where('order_status').in(statusFilter);
      
    }

   

    if (filters.product) {
      const productFilter = Array.isArray(filters.product)
        ? filters.product
        : [filters.product];
      query = query.where('product.product_name').in(productFilter);
    }
    
    query = query.limit(10);
    const orders = await query.exec();

    res.json(orders);
  } catch (err) {
    
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching orders' });
  }
});

router.get('/sorting_orders', async (req, res) => {
  try {
    const filters = req.query;

    let query = Order.find();


    // Sorting functionality
    if (filters.sort) {
      const sortDirection = filters.sort === 'asc' ? 1 : -1;
      query = query.sort({ order_date: sortDirection });
    } else {
      // Default sorting (e.g., descending)
      query = query.sort({ order_date: -1 });
    }

    const orders = await query.exec();

    res.json(orders);
  } catch (err) {
 
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching orders' });
  }
});
router.get('/pagination_orders', async (req, res) => {
  try {
    const filters = req.query;

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the number of documents to skip
    const skipCount = (page - 1) * limit;


    let query = Order.find();

    // Apply filters 
    if (filters.order_status) {
      const statusFilter = Array.isArray(filters.order_status)
        ? filters.order_status
        : [filters.order_status];
      query = query.where('order_status').in(statusFilter);
    }

    if (filters.product) {
      const productFilter = Array.isArray(filters.product)
        ? filters.product
        : [filters.product];
      query = query.where('product.product_name').in(productFilter);
    }

    // Sorting functionality
    if (filters.sort) {
      const sortDirection = filters.sort === 'asc' ? 1 : -1;
      query = query.sort({ order_date: sortDirection });
    } else {
      query = query.sort({ order_date: -1 });
    }

    // Apply pagination
    query = query.skip(skipCount).limit(limit);

    const orders = await query.exec();

    // Get the total count for pagination
    const totalCount = await Order.countDocuments();

    res.json({
      orders,  
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching orders' });
  }
});





module.exports = router;