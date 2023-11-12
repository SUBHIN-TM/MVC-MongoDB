
var express = require('express');
var router = express.Router() 
var userController = require('../controller/routeHandlers')


router.get('/',userController.home);
router.get('/signup',userController.signUpGetPage)
router.post('/signup',userController.signUpPostPage)
router.post('/login',userController.loginPostPage)
router.get('/logout',userController.logoutPage)
router.get('/dashBoard',userController.dashBoardPage)

module.exports = router;
