const { Schema, model } = require("mongoose");

const TaskSchema = Schema(
  {
    proyecto:String,
    conexion:Number,
    text:String,
    url_imagen:String,
    conexion:String,
    codigo:String,
    url_api:String,
    tipo_envio:String,
    apikeys:String
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const gatewa =  model('sistema', TaskSchema);

module.exports = gatewa;