const mongoose = require('../mongodb');

//HERE WE ARE CREATE THE STRUCTURE OF DATABASE AND COLLECTION NAME
const userSchema = new mongoose.Schema({//schema define structure of collections
  username: { type: String, required: true },
  mail:{type:String,unique:true,required:true},
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);//1st argument user is the collectionname of database 2nd argument structure of collection

module.exports = User;
