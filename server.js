const express = require('express');
require("dotenv").config();
const connectDB = require('./db');
const cors = require('cors');
const app = express();
app.use(express.json());
app.set('PORT', 5000 || process.env.PORT);

const routes = require('./routes/index');


app.use(cors())
app.use(routes);




app.get('/', (req, res) => {
  res.send('Hello World!')
})


connectDB(process.env.MONGO_URL)
 .then(() => {
  console.log('Database is connected')
  app.listen(app.get('PORT') , () => {
    console.log("Server is running at " + app.get('PORT'));
  });
 })
 .catch(error => {
  console.log(error)
 })




