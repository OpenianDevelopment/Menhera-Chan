require('dotenv').config();
require('./strategies/discord');
const express = require('express');
const methodOverride = require("method-override");
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const Store = require('connect-mongo')(session);
const routes = require('./routes');



const app = express();
const PORT = process.env.PORT;

mongoid = "mongodb://localhost:27017/Menhera";
    
     mongoose.connect(mongoid,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useFindAndModify: false
    },(err)=>{
        if(err) throw err;
        console.log('Connection Completed')
    });
app.use(session({
    secret: 'dafaqisthat',
    cookie: {
        maxAge: 60000*60*24
    },
    resave: false,
    saveUninitialized: false,
    store: new Store({ mongooseConnection: mongoose.connection})
}))
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine','ejs');
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));


app.use('/',routes);



app.listen(PORT, console.log(`Server Started ar ${PORT}`))