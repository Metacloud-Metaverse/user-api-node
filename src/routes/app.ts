const { Router } = require("express");
const router = Router();
const homeController = require("../controllers/HomeController.ts");
const userController = require("../controllers/UserController.ts");
const auth = require("../middleware/auth.ts");


router.get('/home/test', homeController.test)
router.get('/home/test-db', homeController.testDb)
router.get('/user/generate-guest', userController.generateGuest)
router.get('/user/list', userController.userList)
router.post('/user/login-guest', userController.loginGuest)
router.get("/home/test-jwt", auth, homeController.authenticateToken)


module.exports = router;
