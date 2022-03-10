const { Router } = require("express");
const router = Router();
const homeController = require("../controllers/HomeController.ts");


router.get('/home/test', homeController.test)
router.get('/home/test-db', homeController.testDb)


module.exports = router;
    