const userController = require('../controller/user-controller')
const { body } = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')

const Router = require('express').Router

const router = new Router()

router.post('/registration',
    body('email').isEmail(),
    body("password").isLength({ min: 3, max: 23 }),
    userController.registration
)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)

module.exports = router