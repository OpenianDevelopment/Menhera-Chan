const express = require('express');
const mongoose = require('mongoose');

const app = express();


app.set('view engine', 'ejs');
const CharacterSchema = new mongoose.Schema({
  id: Number,
  name: String,
  image: String,
  gender: String,
  anime: String,
  cost: String,
  wish: String
})

const waifu = mongoose.model('waifu', CharacterSchema)
mongoose.connect('mongodb://localhost:27017/Menhera', { useNewUrlParser: true })
// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));




// Routes
app.get('/', (req, res) => {
  console.log(req.connection.remoteAddress)
  res.render('index')
})
app.get('/commands', (req, res) => {
  res.render('commands')
})
app.get('/support', (req, res) => {
  res.redirect('https://discord.com/invite/a4zkCjg')
})
app.get('/invite', (req, res) => {
  res.redirect('https://discord.com/oauth2/authorize?client_id=731143954032230453&scope=bot%20applications.commands&permissions=268758142')
})
app.get('/characters', (req, res) => {
  res.redirect('/characters/1')
})
app.get('/characters/:page', (req, res) => {
  var perPage = 9
  var page = req.params.page || 1

  waifu
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function (err, characters) {
      waifu.count().exec(function (err, count) {
        if (err) return next(err)
        res.render('characters', {
          characters: characters,
          current: page,
          pages: Math.ceil(count / perPage)
        })
      })
    })
})
app.get('/backtohome', (req, res) => {
  res.redirect('/')
})
app.get('*', (req, res) => {
  res.render('404')
})

const PORT = 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
