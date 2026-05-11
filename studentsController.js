// controllers/auth.controller.js

import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import Estudiante from "../models/Estudiante.js";


// ======================================
// REGISTER STUDENT
// ======================================

export const registerStudent = async (req, res) => {

    const {
        name,
        lastName,
        birthdate,
        email,
        password,
        speciality_id,
        carnet,
        phone
    } = req.body;

    try {

        // Verificar email existente
        const existsStudent =
            await Estudiante.findOne({ email });

        if (existsStudent) {

            return res.status(400).json({
                message: "El estudiante ya existe"
            });
        }

        // Verificar carnet existente
        const existsCarnet =
            await Estudiante.findOne({ carnet });

        if (existsCarnet) {

            return res.status(400).json({
                message: "El carnet ya existe"
            });
        }

        // Encriptar contraseña
        const passwordHashed =
            await bcryptjs.hash(password, 10);

        // Generar código aleatorio
        const randomNumber =
            crypto.randomBytes(3).toString("hex");

        // Crear token temporal
        const token = jsonwebtoken.sign(

            {
                randomNumber,
                name,
                lastName,
                birthdate,
                email,
                password: passwordHashed,
                speciality_id,
                carnet,
                phone
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "15m"
            }
        );

        // Guardar cookie temporal
        res.cookie(
            "registrationCookie",
            token,
            {
                maxAge: 15 * 60 * 1000,
                httpOnly: true
            }
        );

        // Configurar transporter
        const transporter =
            nodemailer.createTransport({

                service: "gmail",

                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

        // Configurar correo
        const mailOptions = {

            from: process.env.EMAIL_USER,

            to: email,

            subject: "Verificación de cuenta",

            text:
                "Tu código de verificación es: " +
                randomNumber +
                " y expira en 15 minutos"
        };

        // Enviar correo
        transporter.sendMail(
            mailOptions,
            (error, info) => {

                if (error) {

                    console.log(error);

                    return res.status(500).json({
                        message:
                            "Error enviando correo"
                    });
                }

                return res.status(200).json({
                    message:
                        "Correo enviado correctamente"
                });
            }
        );

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};


// ======================================
// VERIFY STUDENT
// ======================================

export const verifyStudent = async (req, res) => {

    try {

        // Código que manda frontend
        const { verificationCodeRequest }
            = req.body;

        // Obtener cookie
        const token =
            req.cookies.registrationCookie;

        // Verificar token
        const decoded =
            jsonwebtoken.verify(
                token,
                process.env.JWT_SECRET
            );

        // Extraer información
        const {
            randomNumber,
            name,
            lastName,
            birthdate,
            email,
            password,
            speciality_id,
            carnet,
            phone
        } = decoded;

        // Comparar código
        if (
            verificationCodeRequest
            !== randomNumber
        ) {

            return res.status(400).json({
                message: "Código incorrecto"
            });
        }

        // Crear estudiante REAL
        const newStudent =
            new Estudiante({

                name,
                lastName,
                birthdate,
                email,
                password,
                speciality_id,
                carnet,
                phone,
                isVerified: true
            });

        // Guardar en Mongo
        await newStudent.save();

        // Limpiar cookie
        res.clearCookie("registrationCookie");

        return res.status(200).json({
            message:
                "Estudiante registrado correctamente"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};


// ======================================
// LOGIN STUDENT
// ======================================

export const loginStudent = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Buscar estudiante
        const studentFound =
            await Estudiante.findOne({ email });

        if (!studentFound) {

            return res.status(404).json({
                message:
                    "Estudiante no encontrado"
            });
        }

        // Verificar bloqueo
        if (
            studentFound.timeOut &&
            studentFound.timeOut > Date.now()
        ) {

            return res.status(403).json({
                message:
                    "Cuenta bloqueada temporalmente"
            });
        }

        // Comparar contraseña
        const isMatch =
            await bcryptjs.compare(
                password,
                studentFound.password
            );

        // Password incorrecta
        if (!isMatch) {

            studentFound.loginAttempts += 1;

            // Bloquear después de 3 intentos
            if (
                studentFound.loginAttempts >= 3
            ) {

                studentFound.timeOut =
                    new Date(
                        Date.now()
                        + 5 * 60 * 1000
                    );

                await studentFound.save();

                return res.status(403).json({
                    message:
                        "Cuenta bloqueada por 5 minutos"
                });
            }

            await studentFound.save();

            return res.status(401).json({
                message:
                    "Contraseña incorrecta",
                attempts:
                    studentFound.loginAttempts
            });
        }

        // Reiniciar intentos
        studentFound.loginAttempts = 0;

        studentFound.timeOut = null;

        await studentFound.save();

        // Crear token
        const token = jsonwebtoken.sign(

            {
                id: studentFound._id,
                role: "student"
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }
        );

        // Cookie login
        res.cookie(
            "authToken",
            token,
            {
                httpOnly: true,
                maxAge:
                    24 * 60 * 60 * 1000
            }
        );

        return res.status(200).json({
            message: "Login exitoso"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Error interno"
        });
    }
};


// ======================================
// LOGOUT
// ======================================

export const logoutStudent = async (req, res) => {

    try {

        res.clearCookie("authToken");

        return res.status(200).json({
            message:
                "Sesión cerrada correctamente"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Error interno"
        });
    }
};
