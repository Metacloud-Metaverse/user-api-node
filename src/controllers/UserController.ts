const dbs = require('../models/index.js');

const userModel = dbs.User;
const ApiResponseHandlers = require('../helper/ApiResponse.ts')
let isError = false;



class UserController {
    static async test(req, res, next) {
        try {
            const data = "test user API";
            const message = "user test API is Working";
            ApiResponseHandlers.send(req, res, "DATA", data, message)
        } catch (error) {
            next(error);
        }
    }
    
    static async generateGuest(req, res, next) {
        try {
        const dateToHex = Date.now().toString(16);
        const guest_private_secret = "AC_"+ dateToHex;
        console.log(guest_private_secret)
        const data = {
            guest_private_secret: guest_private_secret,
        }
        await userModel.create(data, "Guest User created successfully"); 
        let user = function (guest_private_secret) {
            return userModel.findOne({ where: { guest_private_secret: guest_private_secret } })
        }
        let userResult = user(guest_private_secret)
        userResult.then(async function (result) {
            if (!result) {
                const err = "error";
                isError = true
                ApiResponseHandler.sendError(req, res, "userList", err, "There is some error Generating a Guest user Please try Again");
            }else{
                const username = "user_" + (result.id += 1000);
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
                    id: result.id,
                    username: username,
                    guest_private_secret: guest_private_secret
                }
                ApiResponseHandlers.send(req, res, "user", data, "Guest-user created successfully")
            }
        })
    
     } catch(error) {
        next(error);
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
                ApiResponseHandlers.send(req, res, "userList", result, "List all user data successfully")
            } else {
                ApiResponseHandlers.send(req, res, "userList", result, "No Data found ")
            }
        })
    }
    catch (error) {
        next(error)
    }
    }
}
module.exports = UserController;