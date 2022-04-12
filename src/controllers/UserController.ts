const dbs = require('../models/index.js');
const userModel = dbs.User;
const Jwt = require("jsonwebtoken");
const apiResponseHandler = require('../helper/ApiResponse.ts')

class UserController {
   
    static async generateGuest(req, res, next) {
        try {
        const dateToHex = Date.now().toString(16);
        const guest_private_secret = "AC_"+ dateToHex;
        const data = {
            guest_private_secret: guest_private_secret,
        }
            await userModel.create(data, "Guest User created successfully"); 
            let isUserExist = await UserController.userExist(guest_private_secret)
            if (!isUserExist) {
                const err = "error";
                apiResponseHandler.sendError(req, res, "data", err, "There is some error Generating a Guest user Please try Again");
            }else{
                const username = "user_" + (isUserExist.id += 1000);
                console.log(username)
                console.log(guest_private_secret)
                let user = function (username) {
                    return userModel.update({ username: username }, { where: { guest_private_secret: guest_private_secret } });
                }
                let userUpdate = user(username)
                userUpdate.then(async function (result){
                console.log(result)
                })
                const data= {
                    id: isUserExist.id,
                    username: username,
                    guest_private_secret: guest_private_secret
                }
                apiResponseHandler.send(req, res, "data", data, "Guest-user created successfully")
            }
     } catch(error) {
        next(error);
    }
    
}
    static async loginGuest(req, res, next) {
        try {
            //authenticate User
            let user_id = req.body.user_id;
            let guest_private_secret = req.body.guest_private_secret;
            let isUserExist = await UserController.userExist(guest_private_secret)
            if (!isUserExist) {
                const err = "error";
                apiResponseHandler.sendError(req, res, "data", err, "No user exist with given user guest_privat_key");
            } else {
                if (user_id !== isUserExist.dataValues.id){
                    const err = "error";
                    apiResponseHandler.sendError(req, res, "data", err, "user_id and guest_privat_key doesn't match");
                }
                const accessToken = Jwt.sign(
                    { user_id: user_id, guest_private_secret },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: "8h",
                    }
                );
             apiResponseHandler.send(req, res, "data", { token_type: "bearer", access_token: accessToken }, "Guest Login JWT access token generated successfully")
            }
            
            } catch (error) {
                next(error)
            }
    }
    static async userList(req, res, next) {
    try {
        //get users form list
        const data = req.body;
        let userList = function () {
            return userModel.findAll()
        }
        let users = userList()
        users.then(function (result) {
            if (Array.isArray(result) && result.length) {
                apiResponseHandler.send(req, res, "data", result, "List all user data successfully")
            } else {
                apiResponseHandler.send(req, res, "data", result, "No Data found ")
            }
        })
    }
    catch (error) {
        // next(error)
    }
    }
    static async userExist(guest_private_secret) {
        return userModel.findOne({ where: { guest_private_secret: guest_private_secret } })
    }
}
module.exports = UserController;