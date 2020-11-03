const express = require("express")
const app = express()
const router = express.Router()
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
        store: new MongoStore({ mongooseConnection: con }),  //connect-mongo new instance to store session data into mongodb("session")
        saveUninitialized:true
}))
//middleware to check routes
app.use((req,res,next)=>{
if (req.session.user && req.session.user_sid) {
    res.redirect("/login")
    
}
next()
})
//.......................................................................Routes(REST APIs).............
app.post("/login-session", function (request, respond) {
    const user_name = request.body.user_name
    const password =  request.body.password
    //respond.session.visits
    if (request.session.visits) { // check to see if user vissits the site 
        request.session.visits ++ // increment if user visits the site more than once
        respond.setHeader('content-type','text/html')
        respond.write("<p> View:" + respond.session.visits + "</p>")
        respond.end()
    }else{
        request.session.visits = 1
        respond.end()      
    }
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