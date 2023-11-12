const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mongoDb', {
  useNewUrlParser: true, //OLD PARSER DEPRECATED,,SO LATEST MONGO DB DRIVER
  useUnifiedTopology: true,//MANAGING SERVER TOPOLOGY
});

const customConnection = mongoose.connection; //CONNECTION TO MONGO DB MANAGED BY MONGOOSE

customConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));
customConnection.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
