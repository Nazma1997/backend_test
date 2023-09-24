const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

function connectDB(connectionString) {
  return mongoose.connect(connectionString)
}

module.exports = connectDB;