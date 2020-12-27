const express = require('express')
require('express-async-errors')
const app = (module.exports = express())
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (_, res) => {
  res.send('Hello world!')
})

app.use(require('./src/routes/middlewares/catch')())
