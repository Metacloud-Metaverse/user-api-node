'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_setting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_setting.init({
    user_id: DataTypes.INTEGER,
    player_name_opacity: DataTypes.DECIMAL,
    scene_load_radius: DataTypes.DECIMAL,
    show_avatar_name: DataTypes.BOOLEAN,
    hide_ui: DataTypes.BOOLEAN,
    graphics_quality: DataTypes.INTEGER,
    base_resolution: DataTypes.INTEGER,
    fps_limit: DataTypes.BOOLEAN,
    rendering_scale: DataTypes.DECIMAL,
    shadow: DataTypes.BOOLEAN,
    draw_distance: DataTypes.INTEGER,
    soft_shadows: DataTypes.BOOLEAN,
    shadow_resolution: DataTypes.INTEGER,
    bloom: DataTypes.BOOLEAN,
    max_hq_avatars: DataTypes.INTEGER,
    volume_master: DataTypes.DECIMAL,
    volume_music: DataTypes.DECIMAL,
    volume_ui: DataTypes.BOOLEAN,
    volume_voice_chat: DataTypes.BOOLEAN,
    allow_voice_chat: DataTypes.INTEGER,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('now')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('now')
    },
  }, {
    sequelize,
    modelName: 'user_setting',
    timestamps: false

  });
  return user_setting;
};