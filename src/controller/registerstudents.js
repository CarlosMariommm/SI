import Estudiante from "../models/estudiantes.js";
import crypto from "crypto";
import nodemailler from "nodemailer";
import jsonwebtoken from "jsonwebtoken"

import bcrypt from "bcryptjs"
import { config } from "../../config.js";

const registerduntsController={}

registerduntsController.register=async(req, res) => {
    try{
        const{name, lastName, email, password, birthdate, speciality_id, carnet, phone, isVerified, loginAttempts, timeOut, }=req.body

        const existStudents=await Estudiante.findOne({email})
        if (existStudents) {
            return res.status(400).json({message: "El estudiante ya está registrado"})
        }
        
        const randomCode=await crypto.randomBytes(20).toString("hex")
    }
    catch{
        return res.status(500).json({message: "Error al registrar el estudiante"})
    }