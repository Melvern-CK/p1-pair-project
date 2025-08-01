const Controller = require('../controllers/controller')
const router = require('express').Router()
const auth = require('../middlewares/auth');

router.get('/', auth, Controller.posts);

router.get('/add', auth, Controller.getAddPost);
router.post('/add', auth, Controller.postAddPost);

router.get('/:id', Controller.postDetail)
router.post("/:id/delete", Controller.deletePost)
router.post("/:id/comment", Controller.postComment);


module.exports = router