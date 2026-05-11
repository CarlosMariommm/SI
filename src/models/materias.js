import {Schema, model} from "mongoose";
import strict from "node:assert/strict";
import { timeStamp } from "node:console";

//Model Materias
const Materias =  new Schema ({
    speciality_id:{type: Schema.Types.ObjectId, ref: "Especialidad"},
    isAvailable:{type: Boolean, default: true}
},
    {
        timeStamp: true,
        strict:false,
    }
)


export default model("Materias", Materias);