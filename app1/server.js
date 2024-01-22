const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const config = require('./config')
const cors = require('cors')

const routerUser = require('./routes/user')
const routerCategory = require('./routes/category')
const routerCompany = require('./routes/company')
const routerProduct = require('./routes/product')
const routerCart = require('./routes/cart')
const routerOrder = require('./routes/order')

const app = express()

app.use(cors('*'))

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use((request, response, next) => {
  
  if (
    request.url == '/user/signin' ||
    request.url == '/user/signup' ||
    request.url.startsWith('/user/verify') ||
    request.url.startsWith('/user/status')
  ) {
  
    next()
  } else {
    const token = request.headers['token']

    try {
      const payload = jwt.verify(token, config.secret)

      request.id = payload['id']
      next()
    } catch (ex) {
      response.send({
        status: 'error',
        error: 'unauthorized access',
      })
    }
  }
})

app.use(routerUser)
app.use(routerCategory)
app.use(routerCompany)
app.use(routerProduct)
app.use(routerCart)
app.use(routerOrder)

app.get('/', (request, response) => {
  response.send('welcome to ecommerce application')
})

app.listen(3000, '0.0.0.0', () => {
  console.log(`server started on port 3000`)
})
