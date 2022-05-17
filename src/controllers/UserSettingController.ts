const dbs = require('../models/index.js');
const userSettingModel = dbs.user_setting;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const jwt = require("jsonwebtoken");
const apiResponseHandler = require('../helper/ApiResponse.ts')

class UserSettingController {
  static async saveUserSetting(req, res, next) {
    try {
      const data = req.body
      data.user_id = req.user.user_id
      console.log(data)
      await userSettingModel.create(data)
      apiResponseHandler.send(req, res, "data", data, "User settings saved successfully")
    } catch {
      apiResponseHandler.sendError(req, res, "data", null, "Error saving user settings. Please try again with correct data.");
    }
  }
  static async fetchUserSetting(req, res, next) {
    try {
      const user_id = req.user.user_id
      const data = await userSettingModel.findOne({ where: { user_id: user_id } })
      apiResponseHandler.send(req, res, "data", data, "Product fetched successfully")
    } catch (error) {
      const message = "Error fetching product, Please try again with correct data"
      apiResponseHandler.sendError(req, res, "data", null, message)
    }
  }
}

module.exports = UserSettingController