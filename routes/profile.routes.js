const router = require('express').Router();
const { image } = require('../libs/multer');
const { register, login, authenticate } = require('../controllers/user.controllers');
const {createProfile} = require('../controllers/profile.controllers');
const {restrict} = require('../middlewares/auth.middlewares');

router.post('/register', image.single(), register);
router.post('/login', image.single(), login);
router.get('/authenticate', restrict, authenticate);

router.post('/profile', image.single('profile_pictures'), createProfile);


module.exports = router;