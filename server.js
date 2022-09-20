const express = require('express')
const app = express()

//==Serve the static files
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

const port = process.env.PORT || 3000

app.listen(port, '0.0.0.0')