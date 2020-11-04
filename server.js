const express = require("express")
const app = express()
const router = express.Router()
const sign_in = require("./model/sign_in")
//const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session) //now directly reads and writes cookies on req/res to session schema
const mongoose = require("mongoose")
//......................................................................models(database)
// setting up connection to mongo database ............................................
const url = 'mongodb://localhost:27017/winner'
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
const con = mongoose.connection
con.on('open', function () {
})
//......................................................................Views(rendering view files)
const port  = 3000
app.set('views', __dirname + "/view")
app.set('view engine',"ejs")
//middlewares
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()) // function to parse cookies from the submitted http request 
// setting session flags, directly reads and writes cookies to mongodb 
app.use(session({ 
        secret: "dean p", // secret flags 
        resave: true, // flag to save same users visitation more than once
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: con }),  //connect-mongo new instance to store session data into mongodb("session")
}))
//middelware to trigers user visitation
app.use( function (req, res, next) {
    if (req.session.visits) { // check to see if user visits the site 
        req.session.visits++ // increment if user visits the site more than once
    } else {
        req.session.visits = 1 // if not the current vist will be one
        res.end()
    }
    next() // and calls the next available middleware 
})
//middleware to check if session user and sid existed and directed it to the login page
app.use((req,res)=>{
if (req.session.user && req.session.user_sid) {
    res.redirect("/login")
}
})
//.......................................................................Routes(REST APIs).............
app.post("/login-session", async function (request, respond) { 
    const new_user = new sign_in({      //creating new model of user schemas
        user_name: request.body.username, //passing submitted data into model
        password: request.body.password

    })
   try {
      const aaa = await new_user.save() // save the model data in mongodb
      respond.json(a) // send the response with json formated of the submitted data back
   } catch (error) {
    respond.json(console.error(error))
       
   }
    //respond.session.visits
    // if (request.session.visits) { // check to see if user vissits the site 
    //     request.session.visits ++ // increment if user visits the site more than once
    //     respond.setHeader('content-type','text/html')
    //     respond.write("<p> View:" + respond.session.visits + "</p>")
    //     respond.end()
    // }else{
    //     request.session.visits = 1
    //     respond.end()      
    // }
})
app.get("/login", function (request, respond) {
     respond.render("usr_login")//,function (err, ejs_file) {
    //     try {
    //         respond.send(ejs_file)
    //     } catch (err) {
    //         respond.send(err)
    //     }
    respond.end()
    })
    
app.listen(port, ()=>console.log(`server listerning on port ${port}`)) 