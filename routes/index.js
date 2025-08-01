const Controller = require('../controllers/controller');
const router = require('express').Router()
const auth = require('../middlewares/auth');
const routerPost = require('./posts')


router.get('/', Controller.home);


router.get('/register', Controller.getRegister);
router.post('/register', Controller.postRegister);
router.get('/login', Controller.getLogin);
router.post('/login', Controller.postLogin);
router.get('/logout', Controller.logout);

router.use('/posts', routerPost)
module.exports = router