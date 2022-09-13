const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('User list')
})

router.get('/new', (req, res) => {
    res.send('New User')
})

//==Dynamic parameters and route chaining
router
    .route('/:id')
    .get((req, res) => {
        res.send('New User ' + req.user.name)
    })
    .put((req, res) => {
        res.send('Update User ' + req.params.id)
    })
    .delete((req, res) => {
        res.send('Delete User ' + req.params.id)
    })

const users = [{name: 'Dee'}]

//==Anytime a route with "id" in it matches, run this MIDDLEWARE
//==Middleware runs in between the request and the respone back to the user
router.param('id', (req, res, next, id) => {
    req.user = users[id]
    next()
})

module.exports = router