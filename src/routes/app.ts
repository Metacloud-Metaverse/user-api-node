const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.ts");
const userController = require("../controllers/UserController.ts");
const userSettingController = require("../controllers/UserSettingController.ts");


router.get('/user/generate-guest', userController.generateGuest)
router.get('/user/list', userController.userList)
router.post('/user/login-guest', userController.loginGuest)
router.post('/user/save-profile', auth, userController.saveProfile)
router.post('/user/save-setting', auth, userSettingController.saveUserSetting)
router.get('/user/fetch-setting', auth, userSettingController.fetchUserSetting)
router.post('/user/get-nonce-to-sign', userController.getNonceToSign)

module.exports = router;
