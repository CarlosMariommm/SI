import Profesor from "../models/Profesor.js";

// Mostrar
export const getTeachers = async (req, res) => {
    try {
        const teachers = await Profesor.find();

        res.status(200).json(teachers);

    } catch (error) {
        res.status(500).json(error);
    }
};

// Obtener uno
export const getTeacherById = async (req, res) => {
    try {
        const teacher = await Profesor.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({
                message: "Profesor no encontrado"
            });
        }

        res.status(200).json(teacher);

    } catch (error) {
        res.status(500).json(error);
    }
};

// Crear
export const createTeacher = async (req, res) => {
    try {
        const newTeacher = new Profesor(req.body);

        await newTeacher.save();

        res.status(201).json({
            message: "Profesor creado",
            newTeacher
        });

    } catch (error) {
        res.status(500).json(error);
    }
};

// Actualizar
export const updateTeacher = async (req, res) => {
    try {
        const updatedTeacher = await Profesor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            message: "Profesor actualizado",
            updatedTeacher
        });

    } catch (error) {
        res.status(500).json(error);
    }
};

// Eliminar
export const deleteTeacher = async (req, res) => {
    try {
        await Profesor.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Profesor eliminado"
        });

    } catch (error) {
        res.status(500).json(error);
    }
};
