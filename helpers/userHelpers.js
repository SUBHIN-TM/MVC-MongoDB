const User = require('../models/user');
const bcrypt=require('bcrypt')


let createUser = (userDetails)=> {
    const { userName,userMail, userPassword } =  userDetails;
    return new Promise( async (resolve,reject) => {
        try{
            const existingUser = await User.findOne({mail:userMail})//it returns object of that or null
            if(!existingUser){
                const hashedPassword = await bcrypt.hash(userPassword,10)
                const user = new User({ username:userName,mail:userMail, password:hashedPassword}); //created an instance
                await user.save();
                console.log(user,"Writed in Databse");
                resolve(user)//returned new user
            }else{
                resolve({existingUser})//return existing user details
            }
           
    
        }catch(error){
            reject(error)
        }
    })
}

module.exports = {
    createUser
}