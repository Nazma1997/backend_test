const router = require('express').Router();
const orderRoutes = require('./order');
const seedRoutes = require('./seed')


router.use('/api/v1/orders', orderRoutes);
router.use('/api/v1/seeds', seedRoutes);


module.exports = router;