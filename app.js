
const express = require('express');
const path = require('path');
const session = require('express-session')
var userRouter=require('./router/userRouter')
const app = express();
const port = 5000;

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './views'));

// app.use(function (req, res, next) { //PREVENT FROM GO BACK
//   res.header(
//     "Cache-Control",
//     "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
// )
// next()
// })

app.use(express.urlencoded({ extended: true }));
app.use(express.json());//TO PARSE THE BODY ALSO INSTED OF THIS WE CAN USE BODYPARSER MIDDLE WARE
app.use(session({secret:'key',cookie:{maxAge:600000000}}))
app.use('/',userRouter)
app.use(express.static(path.join(__dirname, './public')));



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



