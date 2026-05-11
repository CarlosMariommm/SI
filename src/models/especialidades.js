import {Schema, model} from "mongoose";
import strict from "node:assert/strict";
import { timeStamp } from "node:console";
//Model Especialidad
const Especialidad =  new Schema ({
    specialtyName:{type: String},
    isAvailable:{type: Boolean, default: true}
},
    {
        timeStamp: true,
        strict:false,
    }
)

export default model("Especialidad", Especialidad);