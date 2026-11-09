import mongoose from "mongoose";
import { Schema } from "mongoose";

const Usuario = new Schema({
   nome: {
    type: String,
    require: true
   },
   email: {
    type: String,
    require: true
   },
   eAdmin:{
      type: Number,
      default: 0
   },
   senha: {
    type: String,
    require: true
   }
})

mongoose.model("usuarios", Usuario)

export default Usuario 