const express = require('express')
const app = express()

//==Serve the static files
app.use(express.static('public'))

app.set('view engine', 'ejs')

//==Defining the middleware here makes it so all routes below this run it
//app.use(logger)

//==Use middleware inside the route - put as many as you want in
app.get('/', logger, (req, res) => {
    console.log('ss')
    res.render('index', {name: 'Jim'})
})

const userRouter = require('./routes/users')

//==Mount the router on the /users URL
app.use('/users', userRouter)

function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}

const port = process.env.PORT || 3000

app.listen(port)