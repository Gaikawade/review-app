const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const route = require('./router/route.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb+srv://Mahesh8985:lz9fOW52615YVat4@cluster0.l5fafvk.mongodb.net/ReviewApp',{
  useNewUrlParser: true
})
.then( () => console.log('MongoDB is connected'))
.catch( err => console.log(err));

app.use('/', route);

app.listen(process.nextTick.PORT || 3000, () => {
  console.log('Express server listening on port ' + (process.env.PORT || 3000))
});