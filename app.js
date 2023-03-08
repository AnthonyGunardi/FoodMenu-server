require('dotenv').config()
const path = require('path');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const api_key =require('./config/config');
const authRoutes = require('./routes/auth');
const userRoutes=require('./routes/user')
const MONGODB_URI =api_key.mongo;
const app = express();
const options = {
  key: fs.readFileSync('../ssl/privateKey.pem'),
  cert: fs.readFileSync('../ssl/anthonygunardi_com_cert.pem'),
};
const server = https.createServer(
  options, 
  app);
const PORT = 5002;

app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) =>{  // To remove CROS (cross-resource-origin-platform) problem 
  res.setHeader('Access-Control-Allow-Origin',"*"); // to allow all client we use *
  res.setHeader('Access-Control-Allow-Methods',"OPTIONS,GET,POST,PUT,PATCH,DELETE"); //these are the allowed methods 
  res.setHeader('Access-Control-Allow-Headers', "*"); // allowed headers (Auth for extra data related to authoriaztiom)
  next();
})
app.use(authRoutes);
app.use(userRoutes);
app.get('/', (req,res) => {
  res.send('Welcome to Food Menu API')
});

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGODB_URI,{ useUnifiedTopology: true,useNewUrlParser: true, useFindAndModify: false })
    .then(()=> {
          server.listen(PORT);
          console.log(`Server Started at port ${PORT}!`)
      })
    .catch(err => {
      console.log(err);
    });
}
module.exports = app;