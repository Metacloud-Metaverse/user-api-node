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
      const message = "player_name_opacity value is not valid. Value should be between 0 to 1"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.scene_load_radius === null || data.scene_load_radius === "" || (data.scene_load_radius && (data.scene_load_radius > 1 || isNaN(data.scene_load_radius)))) {
      const message = "scene_load_radius value is not valid. Value should be between 0 to 1"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.rendering_scale === null || data.rendering_scale === "" || (data.rendering_scale && (data.rendering_scale > 1 || isNaN(data.rendering_scale)))) {
      const message = "rendering_scale value is not valid. Value should be between 0 to 4"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.volume_master === null || data.volume_master === "" || (data.volume_master && (data.volume_master > 1 || isNaN(data.volume_master)))) {
      const message = "volume_master value is not valid. Value should be between 0 to 1"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.volume_music === null || data.volume_music === "" || (data.volume_music && (data.volume_music > 1 || isNaN(data.volume_music)))) {
      const message = "volume_music value is not valid. Value should be between 0 to 1"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.show_avatar_name === null || data.show_avatar_name === "" || (data.show_avatar_name &&  typeof  data.show_avatar_name !== "boolean")) {
      const message = "show_avatar_name value is not valid. Value should be boolean either true or false"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.hide_ui === null || data.hide_ui === "" || (data.hide_ui && typeof data.hide_ui !== "boolean")) {
      const message = "hide_ui value is not valid. Value should be boolean either true or false"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.fps_limit === null || data.fps_limit === "" || (data.fps_limit && typeof data.fps_limit !== "boolean")) {
      const message = "fps_limit value is not valid. Value should be boolean either true or false"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.shadow === null || data.shadow === "" || (data.shadow && typeof data.shadow !== "boolean")) {
      const message = "shadow value is not valid. Value should be boolean either true or false"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.soft_shadows === null || data.soft_shadows === "" || (data.soft_shadows && typeof data.soft_shadows !== "boolean")) {
      const message = "soft_shadows value is not valid. Value should be boolean either true or false"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.bloom === null || data.bloom === "" || (data.bloom && typeof data.bloom !== "boolean")) {
      const message = "bloom value is not valid. Value should be boolean either true or false"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.volume_ui === null || data.volume_ui === "" || (data.volume_ui && typeof data.volume_ui !== "boolean")) {
      const message = "volume_ui value is not valid. Value should be boolean either true or false"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.volume_voice_chat === null || data.volume_voice_chat === "" || (data.volume_voice_chat && typeof data.volume_voice_chat !== "boolean")) {
      const message = "volume_voice_chat value is not valid. Value should be boolean either true or false"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.graphics_quality === null || data.graphics_quality === "" || (data.graphics_quality && isNaN(data.graphics_quality))) {
      const message = "graphics_quality value is not valid. Value should be integer, and not empty or null"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.base_resolution === null || data.base_resolution === "" || (data.base_resolution && isNaN(data.base_resolution))) {
      const message = "base_resolution value is not valid. Value should be integer, and not empty or null"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.draw_distance === null || data.draw_distance === "" || (data.draw_distance && isNaN(data.draw_distance))) {
      const message = "draw_distance value is not valid. Value should be integer, and not empty or null"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.shadow_resolution === null || data.shadow_resolution === "" || (data.shadow_resolution && isNaN(data.shadow_resolution))) {
      const message = "shadow_resolution value is not valid. Value should be integer, and not empty or null"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.max_hq_avatars === null || data.max_hq_avatars === "" || (data.max_hq_avatars && isNaN(data.max_hq_avatars))) {
      const message = "max_hq_avatars value is not valid. Value should be integer, and not empty or null"
      apiResponseHandler.sendError(req, res, "data", null, message)
    } else if (data.allow_voice_chat === null || data.allow_voice_chat === "" || (data.allow_voice_chat && isNaN(data.allow_voice_chat))) {
      const message = "allow_voice_chat value is not valid. Value should be integer, and not empty or null"
      apiResponseHandler.sendError(req, res, "data", null, message)
    }else{
      return true
    }
  }
}

module.exports = UserSettingController