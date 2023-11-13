const bcrypt=require('bcrypt')
const User = require('../models/user');
const userHelpers = require('../helpers/userHelpers')



//GET HOME PAGE
let home=(req, res) => {
    if(req.session.userDetails){
        res.redirect('/dashBoard')
    }else{
        res.render('login', { title: 'login' });
    }
   
  }



//GET SIGNUP PAGE
  let signUpGetPage= (req, res) => {
    res.render('signup');
  }


  //SIGNUP POST PAGE
  let signUpPostPage= async (req, res) => {
    try {
      const { userName,userMail, userPassword } = req.body; //SHOULD MATCH WITH THE FORM NAME
    //  console.log(nonExistentVariable);//INTENTIONAL ERROR
      userHelpers.createUser(req.body)
      .then((user) => {
        if(user.existingUser){
          console.log("this mail is already in database",user.existingUser.mail);
           return res.status(401).render('signup',{replace: 'CHOOSE ANOTHER MAIL ITS ALREADY IN USE',enteredMail:userMail,enteredPassword:userPassword,enteredName:userName})
          //  return res.status(400).render('signup',{replace: 'CHOOSE ANOTHER MAIL ITS ALREADY IN USE',enteredMail:user.existingUser.mail,enteredPassword:user.existingUser.password,enteredName:user.existingUser.username})

        }else{
           res.render('login',{alert:"ok"})
        }  
      })
  
    } catch (error) {
      console.error('Error signing up:', error);
      // res.status(500).send('Internal Server Error From post server methord');
      res.status(500).render('error',{print:error})
    }
  }

//LOGIN POST PAGE
  let loginPostPage=async (req,res) =>{
    try{
      const {userMail,userPassword} = req.body
       console.log( "Logined mail and password from [login post page] ","mail is:",userMail,"password is:",userPassword);
      const userDataBase=await User.findOne({mail:userMail}) //IT WILL RETURN EITHER OBJECT IF NOT FOUND IT WILL RETURN NULL
      console.log("Logged user details finded from database [login post page] ",userDataBase);

      req.session.userDetails=userDataBase //session stored in the name=userDetails
      console.log(" session created and stored user details to session [login post page]", req.session.userDetails);

      if(userDataBase === null){
      return res.render('login',{replaceMail:'User Does Not Exist You Should SignUp',enteredMail:userMail,enteredPassword:userPassword})
      }

      const passwordMatch=await bcrypt.compare(userPassword,userDataBase.password) //IF MATCHES IT WILL RETURN TRUE IF ITS NOT IT GIVE FALSE
      if(passwordMatch === false){
        return res.render('login',{replacePassword:" Wrong Password",enteredMail:userMail,enteredPassword:userPassword})
      }
      res.redirect('/dashBoard')
  
    }catch(error){
      console.error("erroe due to ",error);
      res.status(500).render('error',{print:error})
      
    }
  }

  let logoutPage = (req, res) => {
    req.session.destroy()
    res.redirect('/')
  }

  let dashBoardPage= (req,res) =>{
    console.log("cookie show ",req.session.userDetails);
    res.render('DashBoard',{userName:req.session.userDetails.username,userMail:req.session.userDetails.mail})

  }

  let updatePage=async(req,res) => {
  try{
    console.log("entered");
    const {newUserName,newUserMail,oldUserPassword,newUserPassword} = req.body
    console.log( "Logined mail and password from [update page] ","user name is:",newUserName, "mail is:",newUserMail,"old password is:",oldUserPassword,"new password is:",newUserPassword);
    console.log("from session details",req.session.userDetails);
    const userDataBase=await User.findOne({mail:req.session.userDetails.mail})
    console.log("finded the original data from databse to check the password",userDataBase);

  }catch(error){
    console.error(error);
    res.status(500).render('error',{print:error})

  }

  }

 

module.exports={home,signUpGetPage,signUpPostPage,loginPostPage,logoutPage,dashBoardPage,updatePage}