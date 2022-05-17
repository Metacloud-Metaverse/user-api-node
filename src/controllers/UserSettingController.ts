const dbs = require('../models/index.js');
const userSettingModel = dbs.user_setting;
const apiResponseHandler = require('../helper/ApiResponse.ts')

class UserSettingController {
  static async saveUserSetting(req, res, next) {
    try {
      const data = req.body
      data.user_id = req.user.user_id
      console.log(data)
      if (await UserSettingController.checkValidation(req, res, data)) {
        await userSettingModel.create(data)
        apiResponseHandler.send(req, res, "data", data, "User settings saved successfully")
      }
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
  static async checkValidation(req, res, data) {
    if (data.player_name_opacity  === null || data.player_name_opacity  === "" || (data.player_name_opacity  && (data.player_name_opacity  > 1 || isNaN(data.player_name_opacity )))) {
      const message = "player_name_opacity value is not valid, Value should be between 0 to 1"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.scene_load_radius === null || data.scene_load_radius === "" || (data.scene_load_radius && (data.scene_load_radius > 1 || isNaN(data.scene_load_radius)))) {
      const message = "scene_load_radius value is not valid, Value should be between 0 to 1"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.rendering_scale === null || data.rendering_scale === "" || (data.rendering_scale && (data.rendering_scale > 1 || isNaN(data.rendering_scale)))) {
      const message = "rendering_scale value is not valid, Value should be between 0 to 4"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.volume_master === null || data.volume_master === "" || (data.volume_master && (data.volume_master > 1 || isNaN(data.volume_master)))) {
      const message = "volume_master value is not valid, Value should be between 0 to 1"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.volume_music === null || data.volume_music === "" || (data.volume_music && (data.volume_music > 1 || isNaN(data.volume_music)))) {
      const message = "volume_music value is not valid, Value should be between 0 to 1"
      apiResponseHandler.sendError(req, res, "data", null, message)
    }else{
      return true
    }
  }
}

module.exports = UserSettingController