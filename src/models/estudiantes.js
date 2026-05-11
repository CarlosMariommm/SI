// name, lastName, email, password, birthdate, speciality_id, carnet, pone, isVerified, loginAttempts, timeOut
import {Schema, model} from "mongoose";
import strict from "node:assert/strict";
import { timeStamp } from "node:console";
//Model Estudiante
const Estudiante =  new Schema ({
    name:{type: String},
    lastName:{type: String},
    email:{type: String, unique: true},
    password:{type: String},
    birthdate:{type: Date},
    speciality_id:{type: Schema.Types.ObjectId, ref: "Especialidad"},
    carnet:{type: String, unique: true},
    phone:{type: String},
    isVerified:{type: Boolean, default: false},
    loginAttempts:{type: Number, default: 0},
    timeOut:{type: Date},
},
    {
        timeStamp: true,
        strict:false,
    }
)




export default model("Estudiante", Estudiante);
