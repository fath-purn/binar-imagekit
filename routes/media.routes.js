const router = require('express').Router();
const { imageStorage, videoStorage, documentStorage, image, video, document } = require('../libs/multer');
const { singleUpload, multiUpload, imagekit, generateQrCode } = require('../controllers/media.controllers');
const { register, login, authenticate } = require('../controllers/user.controllers');
const {createProfile} = require('../controllers/profile.controllers');
const {restrict} = require('../middlewares/auth.middlewares');

router.post('/storage/images', imageStorage.single('image'), singleUpload);
router.post('/storage/videos', videoStorage.single('video'), singleUpload);
router.post('/storage/documents', documentStorage.single('document'), singleUpload);

router.post('/storage/multi/images', imageStorage.array('image'), multiUpload);

router.post('/imagekit/images', image.single('image'), imagekit);
router.post('/imagekit/videos', video.single('video'), imagekit);
router.post('/imagekit/documents', document.single('document'), imagekit);
router.post('/imagekit/qr-codes', generateQrCode);


router.post('/register', image.single(), register);
router.post('/login', image.single(), login);
router.get('/authenticate', restrict, authenticate);

router.post('/profile', image.single('profile_pictures'), createProfile);


module.exports = router;