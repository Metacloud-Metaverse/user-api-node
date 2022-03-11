const { Router } = require("express");
const router = Router();
const homeController = require("../controllers/HomeController.ts");
const userController = require("../controllers/UserController.ts");


router.get('/home/test', homeController.test)
router.get('/user/test', userController.test)
router.get('/user/generate-guest', userController.generateGuest)
router.get('/user/list', userController.userList)


module.exports = router;
