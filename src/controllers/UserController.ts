const ethSigUtil = require('@metamask/eth-sig-util');
const dbs = require('../models/index.js');
const userModel = dbs.User;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const jwt = require("jsonwebtoken");
const apiResponseHandler = require('../helper/ApiResponse.ts')
class UserController {
    static async generateGuest(req, res, next) {
        try {
            const dateToHex = Date.now().toString(16);
            const guest_private_secret = "AC_" + dateToHex;
            const data = {
                guest_private_secret: guest_private_secret,
            }
            await userModel.create(data, "Guest User created successfully");
            let isUserExist = await UserController.userExist(guest_private_secret)
            if (!isUserExist) {
                apiResponseHandler.sendError(req, res, "data", null, "There is some error Generating a Guest user Please try Again");
            } else {
                const username = "user_" + (isUserExist.id += 1000);
                let user = function (username) {
                    return userModel.update({ username: username }, { where: { guest_private_secret: guest_private_secret } });
                }
                let userUpdate = user(username)
                userUpdate.then(async function (result) {
                    console.log(result)
                })
                const data = {
                    id: isUserExist.id,
                    username: username,
                    guest_private_secret: guest_private_secret
                }
                apiResponseHandler.send(req, res, "data", data, "Guest-user created successfully")
            }
        } catch (error) {
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
                apiResponseHandler.sendError(req, res, "data", null, "No user exist with given user guest_privat_key");
            } else {
                if (user_id !== isUserExist.dataValues.id) {
                    apiResponseHandler.sendError(req, res, "data", null, "user_id and guest_privat_key doesn't match");
                }
                const accessToken = jwt.sign(
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
    static async getNonceToSign(req, res, next) {
        try {
            let walletAddress = req.body.address.toUpperCase();
            let guestPrivateSecret = '';
            var isUserExist = await UserController.getUserByWalletAddress(walletAddress);
            if(!isUserExist){
                const dateToHex = Date.now().toString(16);
                guestPrivateSecret = "AC_" + dateToHex;
                const data = {
                    wallet_address: walletAddress,
                    guest_private_secret: guestPrivateSecret,
                }
                isUserExist = await userModel.create(data, "Guest User created successfully");
            } else {
                guestPrivateSecret = isUserExist.guest_private_secret;
            }

            const data = {
                id: isUserExist.id,
                address: walletAddress,
                guest_private_secret: guestPrivateSecret
            }
            apiResponseHandler.send(req, res, "data", data, "Guest-user created successfully")

        } catch (error) {
            next(error);
        }
    }
    static async verifySigned(req, res, next){
        try {
            let walletAddress = req.body.address.toUpperCase();
            let signature = req.body.signature;
            let isUserExist = await UserController.getUserByWalletAddress(walletAddress);
            if(!isUserExist){
                return apiResponseHandler.sendError(req, res, "data", null, "No user exist with address");
            }

            let nonce = isUserExist.guest_private_secret;
            // Recover the address of the account used to create the given Ethereum signature.
            const nonceToHex = `0x${Buffer.from(nonce, 'utf8').toString('hex')}`;
            const recoveredAddress = ethSigUtil.recoverPersonalSignature({
                data: nonceToHex,
                signature: signature,
            });

            // See if that matches the address the user is claiming the signature is from
            if (recoveredAddress.toUpperCase() !== walletAddress) {
                return apiResponseHandler.sendError(req, res, "data", { test: recoveredAddress }, "Signature incorrect");
            }

            const accessToken = jwt.sign(
                { user_id: isUserExist.id, nonce },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "8h",
                }
            );
            apiResponseHandler.send(req, res, "data", { token_type: "bearer", access_token: accessToken }, "Guest Login JWT access token generated successfully")
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
                    apiResponseHandler.send(req, res, "data", null, "No Data found ")
                }
            })
        }
        catch (error) {
            // next(error)
        }
    }
    static async saveProfile(req, res, next) {
        try {
            //save user extra information
            const data = req.body
            if (data.email && data.username) {
                let isValidateEmail = await UserController.validateEmail(data.email)
                let isValidateUsername = await UserController.validateUsername(data.username)
                if (!isValidateEmail) {
                    const message = "Email address is not valid";
                    apiResponseHandler.sendError(req, res, "data", null, message)
                } else if (!isValidateUsername) {
                    const message = "Username is not valid, Only Uppercase [A-Z], Lowercase [a-z], Numbers[0-9], Underscore [_] are allowed and must start with letter. Length must be min 6 and max 15";
                    apiResponseHandler.sendError(req, res, "data", null, message)
                } else {
                    let isUsernameExist = await UserController.usernameExist(data.username, req.user.user_id)
                    let isEmailExist = await UserController.emailExist(data.email, req.user.user_id)
                    if (isUsernameExist) {
                        apiResponseHandler.sendError(req, res, "data", null, "This username is alredy taken. Please try again with some other username");
                    } else if (isEmailExist) {
                        apiResponseHandler.sendError(req, res, "data", null, "This email is already registered");
                    } else {
                        await userModel.update(data, { where: { id: req.user.user_id } });
                        apiResponseHandler.send(req, res, "data", data, "User Profile saved successfully")
                    }
                }
            }
        } catch (error) {
            apiResponseHandler.sendError(req, res, "data", null, "Error saving user profile. Please try again with correct data.");
        }
    }
    static async validateEmail(email) {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }
    static async validateUsername(username) {
        return username.match(/^[A-Za-z][\w_]{5,14}$/);
    }
    static async userExist(guest_private_secret) {
        return userModel.findOne({ where: { guest_private_secret: guest_private_secret } })
    }
    static async getUserByWalletAddress(address) {
        return userModel.findOne({ where: { wallet_address: address } })
    }
    static async usernameExist(username, id) {
        return userModel.findOne({ where: { [Op.and]: [{ username: username }, { id: { [Op.not]: id } }] } })
    }
    static async emailExist(email, id) {
        return userModel.findOne({ where: { [Op.and]: [{ email: email }, { id: { [Op.not]: id } }] } })
    }
}
module.exports = UserController;