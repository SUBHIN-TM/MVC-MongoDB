const bcrypt = require('bcrypt')
const User = require('../models/user');
const userHelpers = require('../helpers/userHelpers')



//GET HOME PAGE
let home = (req, res) => {
  if (req.session.userDetails) {
    res.redirect('/dashBoard')
  } else {
    res.render('login', { title: 'login' });
  }

}



//GET SIGNUP PAGE
let signUpGetPage = (req, res) => {
  res.render('signup');
}


//SIGNUP POST PAGE
let signUpPostPage = async (req, res) => {
  try {
    const { userName, userMail, userPassword } = req.body; //SHOULD MATCH WITH THE FORM NAME
    //  console.log(nonExistentVariable);//INTENTIONAL ERROR
    userHelpers.createUser(req.body)
      .then((user) => {
        if (user.existingUser) {
          console.log("this mail is already in database", user.existingUser.mail);
          return res.status(401).render('signup', { replace: 'CHOOSE ANOTHER MAIL ITS ALREADY IN USE', enteredMail: userMail, enteredPassword: userPassword, enteredName: userName })
          //  return res.status(400).render('signup',{replace: 'CHOOSE ANOTHER MAIL ITS ALREADY IN USE',enteredMail:user.existingUser.mail,enteredPassword:user.existingUser.password,enteredName:user.existingUser.username})

        } else {
          res.render('login', { alert: "ok" })
        }
      })

  } catch (error) {
    console.error('Error signing up:', error);
    // res.status(500).send('Internal Server Error From post server methord');
    res.status(500).render('error', { print: error })
  }
}

//LOGIN POST PAGE
let loginPostPage = async (req, res) => {
  try {
    const { userMail, userPassword } = req.body
    console.log("Logined mail and password from [login post page] ", "mail is:", userMail, "password is:", userPassword);
    const userDataBase = await User.findOne({ mail: userMail }) //IT WILL RETURN EITHER OBJECT IF NOT FOUND IT WILL RETURN NULL
    console.log("Logged user details finded from database [login post page] ", userDataBase);

    req.session.userDetails = userDataBase //session stored in the name=userDetails
    console.log(" session created and stored user details to session [login post page]", req.session.userDetails);

    if (userDataBase === null) {
      return res.render('login', { replaceMail: 'User Does Not Exist You Should SignUp', enteredMail: userMail, enteredPassword: userPassword })
    }

    const passwordMatch = await bcrypt.compare(userPassword, userDataBase.password) //IF MATCHES IT WILL RETURN TRUE IF ITS NOT IT GIVE FALSE
    if (passwordMatch === false) {
      return res.render('login', { replacePassword: " Wrong Password", enteredMail: userMail, enteredPassword: userPassword })
    }
    res.redirect('/dashBoard')

  } catch (error) {
    console.error("erroe due to ", error);
    res.status(500).render('error', { print: error })

  }
}

let logoutPage = (req, res) => {
  req.session.destroy()
  res.redirect('/')
}

let dashBoardPage = (req, res) => {
  console.log("dashbord entered and session details show ", req.session.userDetails);
  res.render('DashBoard', { userName: req.session.userDetails.username, userMail: req.session.userDetails.mail })

}

let updatePage = async (req, res) => {
  try {
    console.log("entered");
    const { newUserName, newUserMail, oldUserPassword, newUserPassword } = req.body
    console.log("Logined mail and password from [update page] ", "user name is:", newUserName, "mail is:", newUserMail, "old password is:", oldUserPassword, "new password is:", newUserPassword);
    console.log("from session details", req.session.userDetails);

    const userDataBase = await User.findOne({ mail: req.session.userDetails.mail }) //finded the current user databse by using session emaIL ID,NOW USERDATABSE HAS FULL DETAILS OF CURRENT USER
    let existingUser;
    if (userDataBase.mail !== newUserMail) {
      existingUser = await User.findOne({ mail: newUserMail })
    }

    const passwordMatch = await bcrypt.compare(oldUserPassword, userDataBase.password)  //COMPARING THE BOTH PSSWRD EQUAL OR NOT

    if (passwordMatch && !existingUser) {
      console.log("password match");
      let newHashedPassword = await bcrypt.hash(newUserPassword, 10)
      const user = await User.findOneAndUpdate(
        { _id: req.session.userDetails._id }, //parameter 1 finding criteria here we ise id
        { $set: { username: newUserName, mail: newUserMail, password: newHashedPassword } }, //update the details
        { new: true }//if succesful it will return modified data to user if it fails it return as null
      );
      if (user) {
        console.log("user data is updated", user);
        res.json({ success: true, message: "User details updated successfully" });
      } else {
        console.log("Cant updates the user details");
        res.status(400).json({ success: false, message: "cant process the updation" });
      }

    } else {
      console.log("password does not match OR Existing email id was choosen ");
      if (existingUser && !passwordMatch) {
        res.status(400).json({ success: false, messageEmail: "Email ALready Exist", messagePassword: "Incorrect password" });
      } else if (!passwordMatch) {
        res.status(400).json({ success: false, messagePassword: "Incorrect password" });
      } else {
        res.status(400).json({ success: false, messageEmail: "Email ALready Exist" });
      }

    }

  } catch (error) {
    console.error(error);
    res.status(500).render('error', { print: error })

  }
}

let deletePage = async (req,res) => {
  try{
    console.log("entered");
    const database = req.session.userDetails//now we have the user details
    console.log("want to delete this account",database);
    const deleteId= req.session.userDetails._id
    const findFromDataBase= await User.findByIdAndDelete(deleteId)

    if(findFromDataBase){//EITHER TRUE OR NULL
      req.session.destroy();
      return res.json({success:true,message:"Account Deleted Successfully"})
    }else{
      return  res.status(400).json({success:false,message:"Account cant Delete Right Now"})//400 server side
    }
  }
  catch(error){
    console.error("error deleting account",error);
    res.status(500).json({success:false,message:"Internal server error"}) //500 INTERNAL SERCVER SIDE ERROR

  }
}

module.exports = { home, signUpGetPage, signUpPostPage, loginPostPage, logoutPage, dashBoardPage, updatePage,deletePage }