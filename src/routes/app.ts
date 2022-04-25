const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.ts");
const userController = require("../controllers/UserController.ts");


router.get('/user/generate-guest', userController.generateGuest)
router.get('/user/list', userController.userList)
router.post('/user/login-guest', userController.loginGuest)
router.post('/user/save-profile', auth, userController.saveProfile)

module.exports = router;
