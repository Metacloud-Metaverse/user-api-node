const { Router } = require("express");
const router = Router();
const homeController = require("../controllers/HomeController.ts");
const userController = require("../controllers/UserController.ts");
const auth = require("../middleware/auth.ts");


router.get('/home/test', homeController.test)
router.get('/user/generate-guest', userController.generateGuest)
router.get('/user/list', userController.userList)
router.post('/user/login-guest', userController.loginGuest)
router.get("/user/test-jwt", auth, userController.authenticateToken)


module.exports = router;
